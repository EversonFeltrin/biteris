create table if not exists `accounts` (
    `id` int(10) unsigned not null auto_increment,
    `account` varchar(50) not null,
    `type` varchar(10) not null,
    `balance` decimal(10,2) not null default '0',
    `created_at` timestamp not null default NOW(),
    `updated_at` timestamp not null default NOW() ON UPDATE NOW(),
    primary key(`id`)
) engine=InnoDB default charset=utf8mb4;