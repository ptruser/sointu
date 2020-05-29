set(Boost_USE_STATIC_LIBS        ON) # Should force using static libraries only
add_definitions( -DBOOST_ALL_NO_LIB ) # This was needed, see here https://stackoverflow.com/questions/28887680/linking-boost-library-with-boost-use-static-lib-off-on-windows
find_package(Boost 1.73.0 REQUIRED) 
include_directories(${Boost_INCLUDE_DIRS})
add_executable(sointu-server server.cpp server.asm)
find_library(SHLWAPI Shlwapi.lib)
file(GLOB SOINTU ${PROJECT_SOURCE_DIR}/src/*.inc
                     ${PROJECT_SOURCE_DIR}/src/*.asm
                     ${PROJECT_SOURCE_DIR}/src/opcodes/*.asm
                     ${PROJECT_SOURCE_DIR}/src/opcodes/*.inc
                     ${PROJECT_SOURCE_DIR}/src/win32/*.asm
                     ${PROJECT_SOURCE_DIR}/src/win32/*.inc
                     ${PROJECT_SOURCE_DIR}/src/win64/*.asm
                     ${PROJECT_SOURCE_DIR}/src/win64/*.inc)
set_source_files_properties(server.asm PROPERTIES OBJECT_DEPENDS "${SOINTU}")
set_source_files_properties(${SOINTU} PROPERTIES HEADER_FILE_ONLY TRUE)
target_compile_definitions(sointu-server PUBLIC SU_USE_INTROSPECTION)
target_link_libraries(sointu-server SHLWAPI)