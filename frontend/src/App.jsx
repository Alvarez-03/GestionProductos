import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Tienda from './pages/tienda/tienda'
import RegistroUsuario from './pages/RegistroUsuario/registro'
import IngresoUsuario from "./pages/ingresarUsuario/login";
import Principal from "./pages/principal/principal";

function App(){
    return(
        <>
        <Router>
            <Routes>
                <Route path="/" element={<Principal/>}/>
                <Route path="/Mitienda" element={<Tienda />} />
                <Route path="/Registrar" element={<RegistroUsuario />} />
                <Route path="/login" element={<IngresoUsuario/>}/>
            </Routes>
        </Router>
        </>
    )
}

export default App;