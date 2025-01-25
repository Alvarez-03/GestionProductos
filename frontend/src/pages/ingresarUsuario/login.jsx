import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom"; 

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

function IngresoUsuario(){
    const [formData, setFormData] = useState({correo: '', clave: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); // Actualizar el estado
    };

    const handleSubmit= async (e)=>{
        e.preventDefault()

        try{
            const response= await fetch(`http://localhost:5000/login`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(formData),
            })


            if (response.ok) {
                const data = await response.json(); 
                console.log('Usuario Login exitoso');

                Swal.fire({
                    icon: "success",
                    title: `Bienvenido ${data.usuario.usuario}!`,
                    showConfirmButton: false,
                    timer: 1800
                });
                
                localStorage.setItem('usuario', JSON.stringify(data.usuario)); // Guardar el objeto del usuario completo
                localStorage.setItem('token', data.token); //Guardar token

                navigate('/Mitienda'); 
            } else {
                const data = await response.json(); 
                console.error('Error al ingresar usuario:', data.message);
                Swal.fire({
                    icon: "error",
                    title: `Verifica tu correo y clave `,
                    showConfirmButton: false,
                    timer: 2000
                });

            }

        }catch{
            console.error('Error en la solicitud:', error);
            Swal.fire({
                icon: "error",
                title: `Error en nuestro servidor. `,
                showConfirmButton: false,
                timer: 2000
            });
        }


    }

    return(
        <main id="contentRegistro">
            <header id="headerRegistro">
                <h1><i className="fa-solid fa-store"></i> Gestion de productos</h1>
                <p>Ingresa a tu tienda!</p>
            </header>
            <form id="formRegistro" onSubmit={handleSubmit}>
                <input type="email" placeholder="Correo Electronico" name="correo" value={formData.correo} onChange={handleChange} required/>
                <input type="password" placeholder="Clave" name="clave" value={formData.clave} onChange={handleChange} required/>
                <button type="submit"> Ingresar</button>
            </form>
            <footer id="footerRegistro">
                <Link to='/Registrar'>Registrarte</Link>
                <Link to='/'>Principal</Link>
            </footer>

        </main>
    )

}

export default IngresoUsuario


