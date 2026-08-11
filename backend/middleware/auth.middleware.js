const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const encabezado = req.headers['authorization'];
  if (!encabezado) return res.status(401).json({ mensaje: 'No se proporcionó un token de acceso.' });

  const token = encabezado.split(' ')[1];
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
  }
}

function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tiene permisos para realizar esta acción.' });
    }
    next();
  };
}

module.exports = { verificarToken, permitirRoles };