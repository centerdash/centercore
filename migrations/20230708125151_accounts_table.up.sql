CREATE TABLE accounts (
    account_id serial PRIMARY KEY,
    username varchar(20) NOT NULL,
    password varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    timestamp int NOT NULL,
    stars int NOT NULL DEFAULT 0,
    diamonds int NOT NULL DEFAULT 0,
    coins int NOT NULL DEFAULT 0,
    user_coins int NOT NULL DEFAULT 0,
    demons int NOT NULL DEFAULT 0,
    creator_points int NOT NULL DEFAULT 0,
    icon int NOT NULL DEFAULT 0,
    icon_type int NOT NULL DEFAULT 0,
    acc_icon int NOT NULL DEFAULT 0,
    acc_ship int NOT NULL DEFAULT 0,
    acc_ball int NOT NULL DEFAULT 0,
    acc_bird int NOT NULL DEFAULT 0,
    acc_dart int NOT NULL DEFAULT 0,
    acc_robot int NOT NULL DEFAULT 0,
    acc_spider int NOT NULL DEFAULT 0,
    acc_glow int NOT NULL DEFAULT 0,
    acc_explosion int NOT NULL DEFAULT 0,
    color1 int NOT NULL DEFAULT 0,
    color2 int NOT NULL DEFAULT 3,
    special int NOT NULL DEFAULT 0,
    ms int NOT NULL DEFAULT 0,
    cs int NOT NULL DEFAULT 0,
    frs int NOT NULL DEFAULT 0,
    youtube varchar(255),
    twitter varchar(255),
    twitch varchar(255)
);