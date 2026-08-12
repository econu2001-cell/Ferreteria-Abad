-- ============================================================
-- BASE DE DATOS - FERRETERÍA ABAD
-- Aiven MySQL 8.4.8
-- Base de datos: defaultdb
-- ============================================================

-- ============================================================
-- TABLA: ROL
-- ============================================================

CREATE TABLE rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(30) NOT NULL UNIQUE
);

-- ============================================================
-- TABLA: USUARIO
-- ============================================================

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    id_rol INT NOT NULL,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol)
        REFERENCES rol(id_rol)
);

-- ============================================================
-- TABLA: CATEGORIA
-- ============================================================

CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    descripcion VARCHAR(200)
);

-- ============================================================
-- TABLA: PRODUCTO
-- ============================================================

CREATE TABLE producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200),
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    stock_minimo INT NOT NULL,
    id_categoria INT NOT NULL,

    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria(id_categoria)
);

-- ============================================================
-- TABLA: CLIENTE
-- ============================================================

CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    dni CHAR(8) UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    direccion VARCHAR(150),
    correo VARCHAR(100)
);

-- ============================================================
-- TABLA: VENTA
-- ============================================================

CREATE TABLE venta (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2) NOT NULL,
    igv DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    id_cliente INT NOT NULL,
    id_usuario INT NOT NULL,

    CONSTRAINT fk_venta_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente),

    CONSTRAINT fk_venta_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
);

-- ============================================================
-- TABLA: DETALLE_VENTA
-- ============================================================

CREATE TABLE detalle_venta (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_detalle_venta
        FOREIGN KEY (id_venta)
        REFERENCES venta(id_venta),

    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
);

-- ============================================================
-- TABLA: COMPROBANTE
-- ============================================================

CREATE TABLE comprobante (
    id_comprobante INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(20) UNIQUE,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo ENUM('Boleta','Factura') NOT NULL,
    ruta_pdf VARCHAR(255),
    id_venta INT NOT NULL,

    CONSTRAINT fk_comprobante_venta
        FOREIGN KEY (id_venta)
        REFERENCES venta(id_venta)
);