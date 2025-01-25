import React from "react";
import { Link } from "react-router-dom"; 


function HeaderPrincipal(){
    return(
        <header id="headerContentPrincipal">
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    <h1><i className="fa-solid fa-store"></i>  Gestion de Productos</h1>
                    <div>
                        <Link to='/Registrar' className="Link btn btn-success">Registrarse</Link>
                        <Link to='/login' className="Link btn btn-success">Ingresar</Link>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default HeaderPrincipal