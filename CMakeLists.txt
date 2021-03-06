cmake_minimum_required(VERSION 3.0)
include(project_version.cmake)
project(StarQuew LANGUAGES NONE VERSION ${STARQUEW_PROJECT_VERSION})

set(STARQUEW_HOME lib/${CMAKE_PROJECT_NAME})
set(STARQUEW_INSTALL_PREFIX ${CMAKE_INSTALL_PREFIX}/${STARQUEW_HOME})
set(CONFDIR ${CMAKE_INSTALL_PREFIX}/etc CACHE STRING "Directory for system wide configuration files")
set(VERSION_SUFFIX "" CACHE STRING "Suffix to append to version number")
configure_file(${CMAKE_SOURCE_DIR}/scripts/StarQuew-ctl ${CMAKE_BINARY_DIR}/scripts/StarQuew-ctl @ONLY)

set(ENV{SKIP_CMAKE} 1) 
message("Setting build version: ${PROJECT_VERSION_MAJOR} ${PROJECT_VERSION_MINOR} ${PROJECT_VERSION_PATCH}${VERSION_SUFFIX}")
execute_process(
    COMMAND python3 ./scripts/set_version.py ${PROJECT_VERSION_MAJOR} ${PROJECT_VERSION_MINOR} ${PROJECT_VERSION_PATCH}${VERSION_SUFFIX}
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
)


add_subdirectory(config)
add_subdirectory(frontend)
add_subdirectory(backend)

install(PROGRAMS ${CMAKE_CURRENT_BINARY_DIR}/scripts/StarQuew-ctl DESTINATION bin)
install(FILES ${CMAKE_SOURCE_DIR}/LICENSE DESTINATION share/StarQuew)
install(FILES ${CMAKE_SOURCE_DIR}/README.md DESTINATION share/StarQuew)

SET(CPACK_GENERATOR "TGZ;DEB")
SET(CPACK_PACKAGE_DIRECTORY ${CMAKE_BINARY_DIR}/packages)
SET(CPACK_PACKAGE_VERSION_MAJOR ${PROJECT_VERSION_MAJOR})
SET(CPACK_PACKAGE_VERSION_MINOR ${PROJECT_VERSION_MINOR})
SET(CPACK_PACKAGE_VERSION_PATCH ${PROJECT_VERSION_PATCH}${VERSION_SUFFIX})
SET(CPACK_RESOURCE_FILE_LICENSE ${CMAKE_SOURCE_DIR}/LICENSE)
SET(CPACK_DEBIAN_PACKAGE_MAINTAINER "Marco Gulino <marco.gulino@gmail.com>")
set(CPACK_DEBIAN_PACKAGE_DEPENDS "python3, python3-pip, python3-venv, nginx | apache2, libatlas-base-dev, libpython3-dev, libindi-dev, swig, build-essential, zlib1g-dev, libnova-dev, libcfitsio-dev, libopenjp2-7, libopencv-dev, libccfits-dev, redis-server, libffi-dev")
set(CPACK_DEBIAN_PACKAGE_ARCHITECTURE all)
include(CPack)
