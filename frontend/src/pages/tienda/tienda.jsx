import React, { useState, useEffect } from "react";
import './tienda.css'

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import HeaderTienda from "../../components/tienda/header/header";


function Tienda(){
    const infousuario= JSON.parse(localStorage.getItem('usuario'))
    const token = localStorage.getItem('token'); 
    const correoUsu= infousuario.correo
    const usuario= infousuario.usuario

        const [formData, setFormData] = useState({
                _id:'',
                nombre: '',
                descripcion: '',
                precio: '',
                categoria:'',
                inventario:'',
                usuario: correoUsu
            });

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value,
            });
        };

    const [showModal, setShowModal] = useState(false); //Estado para modificar producto
    const [productos, setProductos] = useState([]); // Estado para almacenar los productos
    const [loading, setLoading] = useState(true); // Estado para manejar el indicador de carga
    const [reload, setReload] = useState(false); //para Recargar los productos

    // Obtener productos al montar el componente
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch(`http://localhost:5000/producto/${correoUsu}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,  
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setProductos(data);
                } else {
                    console.error('No se encontraron productos del usuario');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false); // Desactivar el indicador de carga
            }
        };

        fetchProductos();
    }, [reload]); 

    const handleReload=()=>{
        setReload(!reload)
    }

    const eliminarProducto= async(id)=>{
            
        try{
            const response = await fetch(`http://localhost:5000/producto/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
            });
    
            if(response.ok){
                console.log(`Producto eliminado`)
                Swal.fire({
                    position: "top-center",
                    icon: "warning",
                    title: "Producto Eliminado",
                    showConfirmButton: false,
                    timer: 2000
                });
                setReload(!reload)
            }else{
                console.log(`Error al Eliminar producto`)
                Swal.fire({
                    position: "top-center",
                    icon: "error",
                    title: "Error Para Eliminar",
                    showConfirmButton: false,
                    timer: 2000
                });
                alert('Error')
                }
            }
        catch(error){
            console.log("error eliminando el producto ",error)
            Swal.fire({
                position: "top-center",
                icon: "error",
                title: "Error Para Eliminar",
                showConfirmButton: false,
                timer: 2000
            });
        }
    }

    

    const ModalEditarProducto= async(producto)=>{
        setFormData({
            _id: `${producto._id}`,
            nombre: `${producto.nombre}`,
            descripcion: `${producto.descripcion}`,
            precio: `${producto.precio}`,
            categoria:`${producto.categoria}`,
            inventario:`${producto.inventario}`,
            usuario:correoUsu
        });
        setShowModal(true)
 
    }
    const SubmitEditarProducto= async(e)=>{
        e.preventDefault();
        try {
            // Realizar la petición PUT al backend para actualizar el producto
            const response = await fetch(`http://localhost:5000/producto/${formData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    descripcion: formData.descripcion,
                    precio: formData.precio,
                    categoria: formData.categoria,
                    inventario: formData.inventario
                }),
            });
    
            if (response.ok) {
                setShowModal(false); // Cerrar el modal después de actualizar
                Swal.fire({
                    position: "top-center",
                    icon: "success",
                    title: "Producto Actualizado",
                    showConfirmButton: false,
                    timer: 2000
                });
                handleReload(); // Recargar los productos para reflejar los cambios
            } else {
                console.error('Error al actualizar el producto');
                Swal.fire({
                    position: "top-center",
                    icon: "error",
                    title: "Error para actualizar el producto",
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                position: "top-center",
                icon: "error",
                title: "Error para actualizar el producto",
                showConfirmButton: false,
                timer: 2000
            });
        }
    }


    if (loading) {
        return <p>Cargando Tus productos {usuario}...</p>;
    }

    return(
        <>
        <HeaderTienda/>
        <main>
            <div>
                <header id="contentHeader">
                    <h2>Tus Productos</h2>
                    <button id="btnReload" className="btn btn-secondary m-1" onClick={handleReload}> 
                        <i className="fa-solid fa-rotate"></i> Recargar Productos
                    </button>
                </header>
                {productos.length === 0 ? (
                    <>
                        <p>No Tienes Productos {usuario}</p>
                        <p> <i className="fa-solid fa-circle-exclamation"></i> clic en recargar productos cuando crees uno nuevo</p>
                    </>
                ) : (
                    <table className="table table-striped ">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Categoria</th>
                                <th>Inventario</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto, index) => (
                                <tr key={producto._id}>
                                    <td>{index + 1}</td>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.descripcion}</td>
                                    <td>${producto.precio}</td>
                                    <td>{producto.categoria}</td>
                                    <td>{producto.inventario}</td>
                                    <td>
                                        <button id="btnElmProduct" title="Eliminar" onClick={()=>eliminarProducto(producto._id)} className="btn btn-success m-1"><i className="fa-solid fa-trash"></i></button>
                                        <button id="btnEdtProduct" title="Modificar" onClick={()=>ModalEditarProducto(producto)} className="btn btn-success m-1"><i className="fa-solid fa-pen-to-square"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Producto</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={SubmitEditarProducto}>
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
                                    <button type="submit" className="btn btn-success">Actualizar Producto</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>

        </>
    )
}

export default Tienda
