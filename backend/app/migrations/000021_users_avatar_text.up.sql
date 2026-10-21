ALTER TABLE `users` MODIFY `avatar` TEXT NULL; -- OIDC providers can send long picture URLs (see issue #775)
