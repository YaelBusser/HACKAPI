-- CreateTable
CREATE TABLE `features` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NULL,
    `description` VARCHAR(255) NOT NULL,
    `date_log` DATETIME(0) NOT NULL,
    `id_feature` INTEGER NULL,
    `status_code` INTEGER NOT NULL,

    INDEX `who`(`id_user`),
    INDEX `id_feature`(`id_feature`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(25) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password` TEXT NOT NULL,
    `token` TEXT NULL,
    `id_role` INTEGER NOT NULL,

    INDEX `id_role`(`id_role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_access_features` (
    `id_user` INTEGER NOT NULL,
    `id_feature` INTEGER NOT NULL,

    INDEX `id_feature`(`id_feature`),
    PRIMARY KEY (`id_user`, `id_feature`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_ibfk_2` FOREIGN KEY (`id_feature`) REFERENCES `features`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `users_access_features` ADD CONSTRAINT `users_access_features_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `users_access_features` ADD CONSTRAINT `users_access_features_ibfk_2` FOREIGN KEY (`id_feature`) REFERENCES `features`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
