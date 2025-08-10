alter table users
    add password_reset_token varchar(255) null after password;

