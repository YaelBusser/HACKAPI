-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 28 oct. 2024 à 16:24
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `hackapi`
--

-- --------------------------------------------------------

--
-- Structure de la table `features`
--

CREATE TABLE `features` (
  `id` int(11) NOT NULL,
  `label` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `features`
--

INSERT INTO `features` (`id`, `label`) VALUES
(1, 'Email address verification tool'),
(2, 'Spam mail (content + number of sends)'),
(3, 'Phising service (creation of a customized phishing web page - backed by AI!)'),
(4, 'Is my password protected ?'),
(5, 'Retrieve all domains & sub-domains associated with a Domain Name'),
(6, 'DDoS'),
(7, 'Random image change'),
(8, 'Fictitious identity generation'),
(9, 'Person information crawler (based on first / last name)'),
(10, 'Secured password generator');

-- --------------------------------------------------------

--
-- Structure de la table `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `date_log` datetime NOT NULL,
  `id_feature` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `logs`
--

INSERT INTO `logs` (`id`, `id_user`, `description`, `date_log`, `id_feature`) VALUES
(2, 2, 'POST /user', '2024-10-11 14:25:19', NULL),
(3, 2, 'POST /user', '2024-10-11 14:42:53', NULL),
(4, 2, 'DELETE /user', '2024-10-11 14:50:03', NULL),
(5, 7, 'DELETE /user', '2024-10-11 14:51:33', NULL),
(6, 7, 'DELETE /user', '2024-10-11 14:51:45', NULL),
(7, 2, 'DELETE /user', '2024-10-11 14:51:53', NULL),
(8, 2, 'DELETE /user', '2024-10-11 14:51:55', NULL),
(9, 2, 'DELETE /user', '2024-10-11 14:52:01', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `label` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`id`, `label`) VALUES
(1, 'admin'),
(2, 'client');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` text NOT NULL,
  `token` text DEFAULT NULL,
  `id_role` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `token`, `id_role`) VALUES
(2, 'admin', '$2a$12$zdWn01hSGFpEkLoKrzMcuuJMAvMZaVmZKADhgrJWsikx3KUpAfpUe', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTcyODY0NzgxOSwiZXhwIjoxNzYwMTgzODE5fQ.uHqmTBT3SsgOVpMxOYoFj-nw6jWpsiY2yaNEhUGbXzw', 1),
(7, 'Yaël', '$2b$10$Po1jOQnHK2fYTbwWWFu21uSmCT9TQHaGjIPbVIeup6tWvMQ1eLkCi', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJZYcOrbCIsImlhdCI6MTcyODY1MjE1MiwiZXhwIjoxNzYwMTg4MTUyfQ.Np9mSB2TUTm2L9PxSWTS1WRq3oBxtOoBoxiErSZLbDI', 2);

-- --------------------------------------------------------

--
-- Structure de la table `users_access_features`
--

CREATE TABLE `users_access_features` (
  `id_user` int(11) NOT NULL,
  `id_feature` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `features`
--
ALTER TABLE `features`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `who` (`id_user`);

--
-- Index pour la table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_role` (`id_role`);

--
-- Index pour la table `users_access_features`
--
ALTER TABLE `users_access_features`
  ADD PRIMARY KEY (`id_user`,`id_feature`),
  ADD KEY `id_feature` (`id_feature`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `features`
--
ALTER TABLE `features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`);

--
-- Contraintes pour la table `users_access_features`
--
ALTER TABLE `users_access_features`
  ADD CONSTRAINT `users_access_features_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `users_access_features_ibfk_2` FOREIGN KEY (`id_feature`) REFERENCES `features` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
