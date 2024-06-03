-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-05-2024 a las 18:41:19
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sorteo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `correo`
--

CREATE TABLE `correo` (
  `email` varchar(60) DEFAULT NULL,
  `nombre_user` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `correo`
--

INSERT INTO `correo` (`email`, `nombre_user`) VALUES
('admin@gmail.com', 'Admin'),
('intranet@gmail.com', 'pruebaIntranet'),
('ruben27@gmail.com', 'ruben27'),
('pruebai@gmail.com', 'borrar577');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `encuesta`
--

CREATE TABLE `encuesta` (
  `id_encuesta` int(6) NOT NULL,
  `nombre_user` varchar(50) DEFAULT NULL,
  `e1` varchar(60) DEFAULT NULL,
  `e2` varchar(60) DEFAULT NULL,
  `e3` varchar(60) DEFAULT NULL,
  `e4` varchar(60) DEFAULT NULL,
  `e5` varchar(60) DEFAULT NULL,
  `e6` varchar(60) DEFAULT NULL,
  `e7` varchar(60) DEFAULT NULL,
  `puntos_encuesta` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `encuesta`
--

INSERT INTO `encuesta` (`id_encuesta`, `nombre_user`, `e1`, `e2`, `e3`, `e4`, `e5`, `e6`, `e7`, `puntos_encuesta`) VALUES
(2, 'ruben27', 'Respuesta1', 'Respuesta2', 'Respuesta3', 'Respuesta4', 'Respuesta5', 'Respuesta6', 'Respuesta7', 3),
(3, 'borrar577', 'Respuesta1', 'Respuesta2', 'Respuesta3', 'Respuesta4', 'Respuesta5', 'Respuesta6', 'Respuesta7', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `juego`
--

CREATE TABLE `juego` (
  `id_juego` int(3) NOT NULL,
  `nombre_juego` varchar(50) DEFAULT NULL,
  `puntos_juego` int(3) DEFAULT NULL,
  `nombre_user` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `juego`
--

INSERT INTO `juego` (`id_juego`, `nombre_juego`, `puntos_juego`, `nombre_user`) VALUES
(2, 'Snake', 4, 'ruben27'),
(3, 'Snake', 4, 'borrar577');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ranking`
--

CREATE TABLE `ranking` (
  `id_ranking` int(11) NOT NULL,
  `nombre_user` varchar(50) DEFAULT NULL,
  `puntos_total` int(3) DEFAULT NULL,
  `fecha_mensua` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tickets`
--

CREATE TABLE `tickets` (
  `id_ticket` int(3) NOT NULL,
  `num_ticket` int(13) DEFAULT NULL,
  `id_tienda` int(11) DEFAULT NULL,
  `nombre_user` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tickets`
--

INSERT INTO `tickets` (`id_ticket`, `num_ticket`, `id_tienda`, `nombre_user`) VALUES
(2, 1000000004, 2, 'ruben27'),
(3, 1000000007, 2, 'borrar577'),
(4, 1000000007, 3, 'Admin'),
(5, 1000000009, 3, 'pruebaIntranet');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tienda`
--

CREATE TABLE `tienda` (
  `id_tienda` int(11) NOT NULL,
  `nombre_tienda` varchar(50) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tienda`
--

INSERT INTO `tienda` (`id_tienda`, `nombre_tienda`, `telefono`) VALUES
(2, 'tienda2', '666666122'),
(3, 'Poly', '666666123'),
(4, 'Juguettoss', '666666129'),
(5, 'Primera', '666666119'),
(6, 'Toys', '666666111'),
(7, 'tercera', '669666123'),
(8, 'ocho', '666666125'),
(9, 'tienda01', '686666123');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_tienda`
--

CREATE TABLE `user_tienda` (
  `id_userT` int(3) NOT NULL,
  `nombre_user` varchar(50) DEFAULT NULL,
  `id_tienda` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user_tienda`
--

INSERT INTO `user_tienda` (`id_userT`, `nombre_user`, `id_tienda`) VALUES
(4, 'ruben27', 3),
(5, 'borrar577', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `nombre_user` varchar(50) NOT NULL,
  `nombre_compl_user` varchar(60) DEFAULT NULL,
  `contrasenia` varchar(30) DEFAULT NULL,
  `fecha_semanal` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`nombre_user`, `nombre_compl_user`, `contrasenia`, `fecha_semanal`) VALUES
('Admin', 'Administrador', 'Password1', NULL),
('borrar577', 'prueba', 'Passwordi1prueba', NULL),
('pruebaIntranet', 'Intranet', 'Pasword1234567', NULL),
('ruben27', 'Rubenn', 'Password1', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `correo`
--
ALTER TABLE `correo`
  ADD KEY `nombre_user` (`nombre_user`);

--
-- Indices de la tabla `encuesta`
--
ALTER TABLE `encuesta`
  ADD PRIMARY KEY (`id_encuesta`),
  ADD KEY `nombre_user` (`nombre_user`);

--
-- Indices de la tabla `juego`
--
ALTER TABLE `juego`
  ADD PRIMARY KEY (`id_juego`),
  ADD KEY `nombre_user` (`nombre_user`);

--
-- Indices de la tabla `ranking`
--
ALTER TABLE `ranking`
  ADD PRIMARY KEY (`id_ranking`),
  ADD KEY `nombre_user` (`nombre_user`);

--
-- Indices de la tabla `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id_ticket`),
  ADD KEY `id_tienda` (`id_tienda`),
  ADD KEY `nombre_user` (`nombre_user`);

--
-- Indices de la tabla `tienda`
--
ALTER TABLE `tienda`
  ADD PRIMARY KEY (`id_tienda`);

--
-- Indices de la tabla `user_tienda`
--
ALTER TABLE `user_tienda`
  ADD PRIMARY KEY (`id_userT`),
  ADD KEY `nombre_user` (`nombre_user`),
  ADD KEY `id_tienda` (`id_tienda`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`nombre_user`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `encuesta`
--
ALTER TABLE `encuesta`
  MODIFY `id_encuesta` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `juego`
--
ALTER TABLE `juego`
  MODIFY `id_juego` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `ranking`
--
ALTER TABLE `ranking`
  MODIFY `id_ranking` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id_ticket` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tienda`
--
ALTER TABLE `tienda`
  MODIFY `id_tienda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `user_tienda`
--
ALTER TABLE `user_tienda`
  MODIFY `id_userT` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `correo`
--
ALTER TABLE `correo`
  ADD CONSTRAINT `correo_ibfk_1` FOREIGN KEY (`nombre_user`) REFERENCES `usuario` (`nombre_user`);

--
-- Filtros para la tabla `encuesta`
--
ALTER TABLE `encuesta`
  ADD CONSTRAINT `encuesta_ibfk_1` FOREIGN KEY (`nombre_user`) REFERENCES `usuario` (`nombre_user`);

--
-- Filtros para la tabla `juego`
--
ALTER TABLE `juego`
  ADD CONSTRAINT `juego_ibfk_1` FOREIGN KEY (`nombre_user`) REFERENCES `usuario` (`nombre_user`);

--
-- Filtros para la tabla `ranking`
--
ALTER TABLE `ranking`
  ADD CONSTRAINT `ranking_ibfk_1` FOREIGN KEY (`nombre_user`) REFERENCES `usuario` (`nombre_user`);

--
-- Filtros para la tabla `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`),
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`nombre_user`) REFERENCES `usuario` (`nombre_user`);

--
-- Filtros para la tabla `user_tienda`
--
ALTER TABLE `user_tienda`
  ADD CONSTRAINT `user_tienda_ibfk_1` FOREIGN KEY (`nombre_user`) REFERENCES `usuario` (`nombre_user`),
  ADD CONSTRAINT `user_tienda_ibfk_2` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
