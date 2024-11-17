/*
  Warnings:

  - Added the required column `tag_route` to the `features` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `features` ADD COLUMN `tag_route` VARCHAR(50) NOT NULL;
