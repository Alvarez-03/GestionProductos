import React from "react";


import './principal.css'
import HeaderPrincipal from "../../components/principal/headerPrincipal";
import MainPrincipal from "../../components/principal/mainPrincipal";
import FooterPrincipal from "../../components/principal/footerPrincipal";

function Principal(){
    return(
        <>
            <HeaderPrincipal/>
            <MainPrincipal/>
            <FooterPrincipal/>
        </>
    )
}

export default Principal