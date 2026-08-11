require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { verificarConexion } = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const rolRoutes = require('./routes/rol.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const productoRoutes = require('./routes/producto.routes');
const clienteRoutes = require('./routes/cliente.routes');
const ventaRoutes = require('./routes/venta.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/ventas', ventaRoutes);

app.get('/', (req, res) => {
    res.json({ mensaje: 'API Ferretería ABAD funcionando correctamente.' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    await verificarConexion();
});