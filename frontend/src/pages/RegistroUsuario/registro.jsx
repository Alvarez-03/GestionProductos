import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom"; 
import './registro.css'

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';



function RegistroUsuario(){
    const [formData, setFormData] = useState({correo: '', usuario:'',clave: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); // Actualizar el estado
    };

    const handleSubmit= async (e)=>{
        e.preventDefault()
        console.log(formData)

        try{
            const response= await fetch('http://localhost:5000/usuarios',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(formData),
            })


            const data = await response.json(); 
            console.log(formData)

            if (response.ok) {
                localStorage.setItem('usuario',JSON.stringify(formData))
                localStorage.setItem('token', data.token); 
                console.log('Usuario registrado exitosamente:', data);
                Swal.fire({
                    position: "top-center",
                    icon: "success",
                    title: "Usuario Creado, Bienvenido!",
                    showConfirmButton: false,
                    timer: 1800
                });
                navigate('/Mitienda'); // Redirigir al usuario a otra página
            } else {
                console.error('Error al registrar usuario:', data.message);
                Swal.fire({
                    position: "top-center",
                    icon: "error",
                    title: "Usuario ya esta registrado o intenta nuevamente.",
                    showConfirmButton: false,
                    timer: 2200
                });
            }

        }catch(error){
            console.error('Error en la solicitud:', error);
            Swal.fire({
                position: "top-center",
                icon: "error",
                title: "Algo salio mal en nuestro servidor :(.",
                showConfirmButton: false,
                timer: 2200
            });
            console.error('Error en la solicitud: ' + error.message);
        }


    }

    return(
        <main id="contentRegistro">
            <header id="headerRegistro">
                <h1><i className="fa-solid fa-store"></i> Gestionador de productos</h1>
                <p>Registrate y gestiona tu tienda!</p>
            </header>
            <form id="formRegistro" onSubmit={handleSubmit}>
                <input type="email" placeholder="Correo Electronico" name="correo" value={formData.correo} onChange={handleChange} required/>
                <input type="text" placeholder="Nombre de Usuario" name="usuario" value={formData.usuario} onChange={handleChange} required/>
                <input type="password" placeholder="Clave" name="clave" value={formData.clave} onChange={handleChange} required/>
                <button type="submit"><i className="fa-solid fa-user-plus"></i> Registrarse</button>
            </form>
            <footer id="footerRegistro">
                <Link to='/Login'>Ingresar</Link>
                <Link to='/'>Principal</Link>
            </footer>

        </main>
    )

}

export default RegistroUsuario


