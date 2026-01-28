DROP TABLE connections_logs;

ALTER TABLE `sessions` ADD `ip_adress` varchar(40) NULL AFTER `active`;

ALTER TABLE `sessions` ADD `location` varchar(200) NULL AFTER `ip_adress`;

ALTER TABLE `sessions` ADD `user_agent` varchar(250) NULL AFTER `location`;

ALTER TABLE `sessions` ADD `type` varchar(15) NULL AFTER `user_agent`;
