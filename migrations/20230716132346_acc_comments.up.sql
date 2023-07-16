CREATE TABLE acc_comments (
    account_comment_id serial PRIMARY KEY,
    account_id int NOT NULL,
    comment varchar(140) NOT NULL,
    likes int NOT NULL DEFAULT 0,
    timestamp int NOT NULL
);