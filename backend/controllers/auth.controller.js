const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuario.model');

async function login(req, res) {
  try {
    const { usuario, contrasena, id_rol } = req.body;

    if (!usuario || !contrasena || !id_rol) {
      return res.status(400).json({
        mensaje: 'Debe ingresar usuario, contraseña y seleccionar un rol.',
      });
    }

    const usuarioEncontrado = await usuarioModel.buscarPorUsuario(usuario);

    if (!usuarioEncontrado) {
      return res.status(401).json({ mensaje: 'Usuario, contraseña o rol incorrectos.' });
    }

    if (usuarioEncontrado.estado !== 'Activo') {
      return res.status(403).json({ mensaje: 'El usuario se encuentra inactivo.' });
    }

    // El rol elegido en el login debe coincidir con el rol real del usuario
    if (Number(usuarioEncontrado.id_rol) !== Number(id_rol)) {
      return res.status(401).json({ mensaje: 'Usuario, contraseña o rol incorrectos.' });
    }

    const contrasenaCorrecta = await bcrypt.compare(contrasena, usuarioEncontrado.contrasena);

    if (!contrasenaCorrecta) {
      return res.status(401).json({ mensaje: 'Usuario, contraseña o rol incorrectos.' });
    }

    const token = jwt.sign(
      {
        id_usuario: usuarioEncontrado.id_usuario,
        nombre: `${usuarioEncontrado.nombres} ${usuarioEncontrado.apellidos}`.trim(),
        rol: usuarioEncontrado.nombre_rol,
        id_rol: usuarioEncontrado.id_rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso.',
      token,
      usuario: {
        id_usuario: usuarioEncontrado.id_usuario,
        nombre: `${usuarioEncontrado.nombres} ${usuarioEncontrado.apellidos}`.trim(),
        rol: usuarioEncontrado.nombre_rol,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

module.exports = { login };