# =============================================================================
# © You i Labs Inc. 2000-2019. All rights reserved.
cmake_minimum_required(VERSION 3.5 FATAL_ERROR)

if(__yi_configure_framework_included)
    return()
endif()
set(__yi_configure_framework_included 1)

# =============================================================================
# Adds the specified Framework to the given target. This will also handle copying
# and code signing of the Framework into the build target's 'Frameworks' folder
# if the 'EMBEDDED' option is specified.
#
# NOTE: If the 'EMBEDDED' option is given, the 'CODE_SIGN_IDENTITY' argument will
# be required. Failure will occur if the 'CODE_SIGN_IDENTITY' argument is empty or
# not specified.
#
# Arguments:
#   - TARGET: The name of the target to which the Framework will be added.
#   - FRAMEWORK_PATH: The path of the source Framework to be used.
#   - CODE_SIGN_IDENTITY: (Optional) The code signing identity to be used when the
#           'EMBEDDED' option has been set.
#   - EMBEDDED: (Optional) Indicates to the function that the Framework is to be
#           treated as an Embedded Framework. This will result in the Framework
#           being copied to the application's 'Frameworks' folder and then resigned
#           using the 'CODE_SIGN_IDENTITY' value.
#
function(yi_configure_framework)
    set(_REQUIRED_ARGS TARGET FRAMEWORK_PATH)

    cmake_parse_arguments(ARGS
        "EMBEDDED"
        "${_REQUIRED_ARGS};CODE_SIGN_IDENTITY"
        ""
        ${ARGV}
    )

    foreach(_ARG IN LISTS _REQUIRED_ARGS)
        if(NOT ARGS_${_ARG})
            message(FATAL_ERROR "Missing required argument: ${_ARG}")
        endif()
    endforeach()

    if(ARGS_UNUSED_ARGUMENTS)
        message(FATAL_ERROR "Encountered unused arguments: ${ARGS_UNUSED_ARGUMENTS}")
    endif()

    target_include_directories(${ARGS_TARGET} PRIVATE ${ARGS_FRAMEWORK_PATH})
    target_link_libraries(${ARGS_TARGET} PRIVATE ${ARGS_FRAMEWORK_PATH})

    get_filename_component(_FRAMEWORK_NAME ${ARGS_FRAMEWORK_PATH} NAME)

    if(NOT ${ARGS_EMBEDDED})
        message(STATUS "Added non-Embedded Framework: ${_FRAMEWORK_NAME}")
    else()
        message(STATUS "Added Embedded Framework: ${_FRAMEWORK_NAME}")
        if(NOT ARGS_CODE_SIGN_IDENTITY OR "x${ARGS_CODE_SIGN_IDENTITY}" STREQUAL "x")
            message(FATAL_ERROR "The Framework '${ARGS_FRAMEWORK_PATH}' was marked as an EMBEDDED Framework. To code sign the Framework, the CODE_SIGN_IDENTITY argument needs to be given the code signing identity to use.")
        endif()

        # Sanitize un-escaped parenthesis from ARGS_CODE_SIGN_IDENTITY
        # Example:    iPhone Developer (XXXXX) -> iPhone Developer \(XXXXX\)
        # Example 2:  iPhone Developer \(XXXXX\) -> iPhone Developer \(XXXXX\)
        # Example 3:  iPhone Developer(XXXXX) -> iPhone Developer\(XXXXX\)
        string(REGEX REPLACE "([^\\\\])\\\(" "\\1\\\\(" CODE_SIGN_IDENTITY_CORRECTED ${ARGS_CODE_SIGN_IDENTITY})
        string(REGEX REPLACE "([^\\\\])\\\)" "\\1\\\\)" CODE_SIGN_IDENTITY_CORRECTED ${CODE_SIGN_IDENTITY_CORRECTED})

        # Embedded frameworks need to be copied to the regular build folder and code signed when creating regular builds.
        # When creating archives, however, the embedded frameworks need to be copied into Xcode's '${INSTALL_DIR}' path and
        # code signed from that location.
        foreach(_DESTINATION_FRAMEWORK_FILEPATH "$<TARGET_FILE_DIR:${ARGS_TARGET}>" "\${INSTALL_DIR}/${ARGS_TARGET}.app")
            add_custom_command(TARGET ${ARGS_TARGET} PRE_BUILD
                COMMAND ${CMAKE_COMMAND} -E copy_directory
                    "${ARGS_FRAMEWORK_PATH}"
                    "${_DESTINATION_FRAMEWORK_FILEPATH}/Frameworks/${_FRAMEWORK_NAME}"
            )
            
            add_custom_command(TARGET ${ARGS_TARGET} PRE_BUILD
                COMMAND codesign
                    -s "${CODE_SIGN_IDENTITY_CORRECTED}"
                    -fv
                    "${_DESTINATION_FRAMEWORK_FILEPATH}/Frameworks/${_FRAMEWORK_NAME}"
            )
        endforeach()
    endif()
endfunction(yi_configure_framework)


# =============================================================================
# Adds any frameworks found in  thirdparty/${YI_PLATFORM_LOWER}/Frameworks to the given target.
# Consider using yi_configure_framework() as it is more explicit.
#
# Arguments:
#   - TARGET: The name of the target to which the Frameworks will be added.
#

function(yi_find_and_configure_frameworks)
    set(SINGLE_VALUE_ARGS TARGET)

    cmake_parse_arguments(_ARGS
        ""
        "${SINGLE_VALUE_ARGS}"
        ""
        ${ARGN}
    )

    foreach(_ARG IN LISTS SINGLE_VALUE_ARGS)
        if(NOT _ARGS_${_ARG})
            message(FATAL_ERROR "Missing required argument: ${_ARG}")
        endif()
    endforeach(_ARG IN LISTS SINGLE_VALUE_ARGS)

    if(_ARGS_UNUSED_ARGUMENTS)
        message(FATAL_ERROR "Encountered unsupported arguments: ${_ARGS_UNUSED_ARGUMENTS}")
    endif()

    file(GLOB_RECURSE _FRAMEWORKS LIST_DIRECTORIES true "${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/${YI_PLATFORM_LOWER}/Frameworks/*.framework/")

    foreach(_FRAMEWORK IN LISTS _FRAMEWORKS)
        # Make sure its a framework
        if(IS_DIRECTORY ${_FRAMEWORK} AND ${_FRAMEWORK} MATCHES ".*\\.framework$")
            if (NOT _DEPRECATED_CONFIGURE_FOUND)
                message(WARNING "Using yi_link_external_libraries or yi_find_and_configure_frameworks is deprecated.\nPlease use yi_configure_framework() directly as it supports copying the framework into the application archive.\n")
                set(_DEPRECATED_CONFIGURE_FOUND ON)
            endif()
            target_include_directories(${_ARGS_TARGET} PRIVATE ${_FRAMEWORK})
            target_link_libraries(${_ARGS_TARGET} PRIVATE ${_FRAMEWORK})

            get_filename_component(_FRAMEWORK_NAME ${_FRAMEWORK} NAME)
            message(STATUS "Added framework found in thirdparty/${YI_PLATFORM_LOWER}/Frameworks:${_FRAMEWORK_NAME}")
        endif()
    endforeach()
endfunction(yi_find_and_configure_frameworks)

# =============================================================================
# Original name for yi_find_and_configure_frameworks
#
function(yi_link_external_libraries)
    yi_find_and_configure_frameworks(${ARGN})
endfunction(yi_link_external_libraries)
