# =============================================================================
# © You i Labs Inc. 2000-2019. All rights reserved.
file(GLOB_RECURSE YI_PROJECT_SOURCE "src/*.cpp" "src/*.mm")

file(GLOB_RECURSE YI_PROJECT_HEADERS "src/*.h")

if (IOS)
    list(REMOVE_ITEM YI_PROJECT_HEADERS "${CMAKE_CURRENT_SOURCE_DIR}/src/tvos/AppDelegate.h")
    list(REMOVE_ITEM YI_PROJECT_SOURCE "${CMAKE_CURRENT_SOURCE_DIR}/src/tvos/AppDelegate.mm")
    list(REMOVE_ITEM YI_PROJECT_SOURCE "${CMAKE_CURRENT_SOURCE_DIR}/src/tvos/main.mm")
endif()

if (TVOS)
    list(REMOVE_ITEM YI_PROJECT_HEADERS "${CMAKE_CURRENT_SOURCE_DIR}/src/ios/AppDelegate.h")
    list(REMOVE_ITEM YI_PROJECT_SOURCE "${CMAKE_CURRENT_SOURCE_DIR}/src/ios/AppDelegate.mm")
    list(REMOVE_ITEM YI_PROJECT_SOURCE "${CMAKE_CURRENT_SOURCE_DIR}/src/ios/main.mm")
endif()
