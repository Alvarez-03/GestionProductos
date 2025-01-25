import React, {useState} from "react";
import { Link } from "react-router-dom"; 

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './header.css'

function HeaderTienda(){
    const infousuario= JSON.parse(localStorage.getItem('usuario'))
    const correoUsu= infousuario.correo
    const usuario= infousuario.usuario
    const token = localStorage.getItem('token'); 

    //Formulario Crear Producto
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria:'',
        inventario:''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit= async (e)=>{
        e.preventDefault();

        const producto= {...formData, usuario: correoUsu}

        try{
            const response= await fetch('http://localhost:5000/producto',{
                method:'POST',
                headers:{
                    'content-type':'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(producto)
            })
            if(response.ok){
                Swal.fire({
                    position: "top-center",
                    icon: "success",
                    title: "Producto Creado, Recuerda Recargar los productos!",
                    showConfirmButton: false,
                    timer: 1800
                  });
                setShowModal(false);
                setFormData({ nombre: '', descripcion: '', precio: '',categoria:'',inventario:'' });
                
            }
            else{
                console.error(error)
                Swal.fire({
                    position: "top-center",
                    icon: "error",
                    title: "Error al crear el producto.",
                    showConfirmButton: false,
                    timer: 1800
                  });
            }
        }catch(error){
            console.error(error)
            alert('Error al enviar datos al servidor. ')
        }
    }

    return(

        <>
            <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom" id="headerTienda">
                <h1 className="d-flex align-items-center mb-3 mb-md-0 me-md-auto "> <i className="fa-solid fa-store"></i> Tu tienda </h1>
                <h2 className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
                👋🏻 Hola, {usuario}
                </h2>

                <ul className="nav nav-pills">
                    <li className="nav-item"> 
                        <button className="btn btn-primary" onClick={()=> setShowModal(true)}>Crear Producto</button>
                    </li>
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Salir</Link>
                    </li>
                </ul>

            </header>

            {showModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Crear Producto</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="descripcion" className="form-label">Descripción</label>
                                        <textarea
                                            className="form-control"
                                            id="descripcion"
                                            name="descripcion"
                                            value={formData.descripcion}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="precio" className="form-label">Precio</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="precio"
                                            name="precio"
                                            value={formData.precio}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="categoria" className="form-label">Categoria</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="categoria"
                                            name="categoria"
                                            value={formData.categoria}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="inventario" className="form-label">Cantidad en Inventario</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="inventario"
                                            name="inventario"
                                            value={formData.inventario}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success">Crear Producto</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default HeaderTienda