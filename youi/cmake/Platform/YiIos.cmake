# =============================================================================
# © You i Labs Inc. 2000-2019. All rights reserved.
cmake_minimum_required(VERSION 3.9 FATAL_ERROR)

if(__yi_custom_platform_included)
    return()
endif()
set(__yi_custom_platform_included 1)

include(${YouiEngine_DIR}/cmake/Platform/YiIos.cmake)

macro(yi_configure_platform)
    cmake_parse_arguments(_ARGS "" "PROJECT_TARGET" "" ${ARGN})

    if(NOT _ARGS_PROJECT_TARGET)
        message(FATAL_ERROR "'yi_configure_platform' requires the PROJECT_TARGET argument be set")
    endif()

    _yi_configure_platform(PROJECT_TARGET ${_ARGS_PROJECT_TARGET})

    include(Modules/apple/YiConfigureFramework)
    yi_configure_framework(TARGET ${_ARGS_PROJECT_TARGET}
        FRAMEWORK_PATH "${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/${YI_PLATFORM_LOWER}/Frameworks/GoogleCast.framework"
        CODE_SIGN_IDENTITY ${YI_CODE_SIGN_IDENTITY}
        EMBEDDED
    )

    include(Modules/apple/YiFindFrameworkHelper)

    target_link_libraries(${PROJECT_NAME} PRIVATE "-framework CoreLocation")

endmacro(yi_configure_platform)
