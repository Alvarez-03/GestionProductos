import React from "react";
import { Link } from "react-router-dom"; 


function MainPrincipal(){
    return(
        <main id="contentPrincipal">
            <h2><i className="fa-solid fa-boxes-stacked"></i> <strong>Gestiona tus productos de una manera más eficiente</strong></h2>
            <p>Somos un aplicativo web que te permite administrar tu inventario en cualquier lugar.</p>
            <div>
                <Link to='/registrar'><button className="btn btn-primary"><i className="fa-solid fa-door-open"></i> Probar ahora</button></Link>
                <a href="https://youtu.be/ZjzOX9_jUNk" target="_blank"><button className="btn btn-primary">Ver demostración</button></a>
            </div>
        </main>
    )
}

export default MainPrincipal