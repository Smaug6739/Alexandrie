ALTER TABLE `calendar_events` 
ADD COLUMN `recurrence_pattern` VARCHAR(50) NOT NULL DEFAULT 'none' COMMENT '0, daily, weekly, monthly',
ADD COLUMN `recurrence_interval` INT NOT NULL DEFAULT 1 COMMENT 'multiplier for each interval',
ADD COLUMN `recurrence_end` BIGINT NULL COMMENT 'End the reccurence';
