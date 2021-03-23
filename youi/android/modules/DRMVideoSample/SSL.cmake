
if(YI_ENABLE_CLEARTEXT)
    set(_CLEARTEXT_TRAFFIC "true")
else()
    set(_CLEARTEXT_TRAFFIC "false")
endif()

if(EXISTS ${CMAKE_CURRENT_LIST_DIR}/src/main/res/raw/cacert.pem)
    file(REMOVE ${CMAKE_CURRENT_LIST_DIR}/src/main/res/raw/cacert.pem)
endif()

if(EXISTS ${CMAKE_CURRENT_LIST_DIR}/src/main/res/xml/network_security_config.xml)
    file(REMOVE ${CMAKE_CURRENT_LIST_DIR}/src/main/res/xml/network_security_config.xml)
endif()

if(YI_SSL_CAPTURE)
    set(_SSL_DEBUG_CONFIG "    \n")
    string(APPEND _SSL_DEBUG_CONFIG "    <debug-overrides>\n")
    string(APPEND _SSL_DEBUG_CONFIG "        <trust-anchors>\n")
    string(APPEND _SSL_DEBUG_CONFIG "            <certificates src=\"user\"/>\n")
    string(APPEND _SSL_DEBUG_CONFIG "            <certificates src=\"@raw/cacert\"/>\n")
    string(APPEND _SSL_DEBUG_CONFIG "        </trust-anchors>\n")
    string(APPEND _SSL_DEBUG_CONFIG "    </debug-overrides>")

    file(
        COPY ${CMAKE_CURRENT_LIST_DIR}/../../../AE/assets/cacert.pem
        DESTINATION ${CMAKE_CURRENT_LIST_DIR}/src/main/res/raw
    )
endif()

configure_file(
    ${CMAKE_CURRENT_LIST_DIR}/network_security_config.xml.in
    ${CMAKE_CURRENT_LIST_DIR}/src/main/res/xml/network_security_config.xml
    @ONLY
)