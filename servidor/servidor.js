require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.log('Error al conectar a MongoDB', err));

function verificarToken(req, res, next) {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }
  
  // Verificar el token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  
    req.usuario = decoded; 
    next(); 
  });
}

//crear un usuario
app.post('/usuarios', async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);
        const { correo, usuario, clave } = req.body;

  
      // Verificar si el usuario ya existe
      const usuarioExistente = await mongoose.connection.db.collection('usuarios').findOne({ correo });
      if (usuarioExistente) {
        return res.status(400).json({ message: 'El correo ya está registrado' });
      }
      
      //encriptar clave
      const hashedPassword = await bcrypt.hash(clave, 10);

      // Crear nuevo usuario
      const nuevoUsuario = { correo, usuario, clave: hashedPassword };
      await mongoose.connection.db.collection('usuarios').insertOne(nuevoUsuario);
      console.log('Usuario creado:', nuevoUsuario);
      res.status(201).json({ message: 'Usuario creado exitosamente', nuevoUsuario });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(400).json({ message: 'Error al crear usuario', error });
    }
  });

  //Validar Ingreso
app.post('/login', async (req, res) => {
  try {
      const { correo, clave } = req.body;

      // Buscar usuario por correo
      const usuario = await mongoose.connection.db.collection('usuarios').findOne({ correo });

      if (!usuario) {
          return res.status(404).json({ message: 'El usuario no existe' });
      }

      // Verificar si la clave es correcta
      const isMatch = await bcrypt.compare(clave, usuario.clave); 
      if (!isMatch) {
          return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      const token = jwt.sign({ id: usuario._id, correo: usuario.correo }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({
          message: 'Inicio de sesión exitoso',
          usuario: { correo: usuario.correo, usuario: usuario.usuario },
          token
      });
  } catch (error) {
      console.error('Error al realizar login:', error);
      res.status(500).json({ message: 'Error interno del servidor', error });
  }
});
  
  // Crear un producto
  app.post('/producto', async (req, res) => {
    try {
      const { nombre, descripcion, precio,categoria, inventario, usuario } = req.body;
  
      // Verificar si el usuario existe
      const usuarioExistente = await mongoose.connection.db.collection('usuarios').findOne({ correo: usuario });
      if (!usuarioExistente) {
        return res.status(400).json({ message: 'El usuario no existe' });
      }
  
      // Crear nuevo producto
      const nuevoProducto = { nombre, descripcion, precio, categoria, inventario, usuario };
      await mongoose.connection.db.collection('producto').insertOne(nuevoProducto);
      console.log('Producto creado:', nuevoProducto);
      res.status(201).json({ message: 'Producto creado exitosamente', nuevoProducto });
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(400).json({ message: 'Error al crear producto', error });
    }
  });
//Actualizar producto
app.put('/producto/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { nombre, descripcion, precio, categoria, inventario } = req.body;

      // Convertir el ID a un ObjectId
      const objectId = new mongoose.Types.ObjectId(id);

      // Buscar y actualizar el producto con el id proporcionado
      const result = await mongoose.connection.db.collection('producto').updateOne(
          { _id: objectId }, // Filtrar por el ID del producto
          {
              $set: { nombre, descripcion, precio, categoria, inventario } // Actualizar los campos
          }
      );

      if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Producto no encontrado' });
      }

      res.status(200).json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(400).json({ message: 'Error al actualizar producto', error });
  }
});



//obtener usuarios
app.get('/usuarios', verificarToken, async (req, res) => {
    try {
      const Usuarios= await mongoose.connection.db.collection('usuarios').find({}).toArray();
      console.log('Productos encontrados:', Usuarios); 
      res.status(200).json(Usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(400).json({ message: 'Error al obtener usuarios', error });
    }
  });

//obtener usuario por correo
  app.get('/usuarios/:correo', async (req, res) => {
    try {
      const { correo } = req.params;
      console.log(`Buscando usuarios con correo: ${correo}`);
      const Usuario = await mongoose.connection.db
        .collection('usuarios') // Nombre exacto de la colección
        .findOne({ correo: correo }) // Filtrar 

      console.log('Usuario encontrado:', Usuario);
      res.status(200).json({
        message: Usuario,
        
      })
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(400).json({ message: 'Usuario no existe', error });
    }
  });

//obtener productos
app.get('/producto', async (req, res) => {
    try {
      const productos = await mongoose.connection.db.collection('producto').find({}).toArray();
      console.log('Productos encontrados:', productos); 
      res.status(200).json(productos);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(400).json({ message: 'Error al obtener productos', error });
    }
  });

//eliminar un producto
app.delete('/producto/:id', async (req, res) => {
  try {
      const { id } = req.params;
      console.log(`Eliminando producto con ID: ${id}`);

      const objectId = new mongoose.Types.ObjectId(id);

      // Eliminar el producto por ID
      const result = await mongoose.connection.db
          .collection('producto')
          .deleteOne({ _id: objectId });

      if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Producto no encontrado' });
      }

      console.log('Producto eliminado',id);
      res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(400).json({ message: 'Error al eliminar producto', error });
  }
});

//obtener Productos por usuario
app.get('/producto/:correo', async (req, res) => {
    try {
      const { correo } = req.params;
      console.log(`Buscando productos del usuario con correo: ${correo}`);
      const productos = await mongoose.connection.db
        .collection('producto') 
        .find({ usuario: correo }) 
        .toArray();
      console.log('Productos encontrados:', productos);
      res.status(200).json(productos);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(400).json({ message: 'Error al obtener productos', error });
    }
  });

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});


