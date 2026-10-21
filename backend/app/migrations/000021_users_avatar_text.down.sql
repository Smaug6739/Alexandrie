ALTER TABLE `users` MODIFY `avatar` VARCHAR(150) NULL; -- Values longer than 150 characters make this fail in strict SQL mode
