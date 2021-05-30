/* type = deposito ou saque*/
create table if not exists `transactions` (
    `id` int(10) unsigned not null auto_increment,
    `operation` varchar(10) not null,
    `value` decimal(10,2) not null default '0',  
    `disconted_amount` decimal(10,2) not null default '0',
    `account_id` int(10) unsigned not null,
    `created_at` timestamp not null default NOW(),
    `updated_at` timestamp not null default NOW() ON UPDATE NOW(),
    primary key(`id`),
     KEY `FK_Account_Transaction` (`account_id`),
    CONSTRAINT `FK_Account_Transaction` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`)
) engine=InnoDB default charset=utf8mb4;