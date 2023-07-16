use actix_web::{Responder, HttpResponse, post, web::{Data, Form}};
use serde::Deserialize;
use sqlx::PgPool;

use crate::{models::acc_comment::AccountComment, utils::timestamp::relative_timestamp};

#[derive(Debug, Deserialize)]
struct Body {
    #[serde(rename = "accountID")]
    account_id: i64,
    page: i64,
}

#[post("/getGJAccountComments20.php")]
async fn handler(form: Form<Body>, db: Data<PgPool>) -> impl Responder {
    let comments_count: (i64,) = sqlx::query_as("SELECT count(*) FROM acc_comments WHERE account_id = $1")
        .bind(&form.account_id)
        .fetch_one(db.get_ref())
        .await.unwrap();

    if comments_count.0 == 0 {
        return HttpResponse::Ok().body("#0:0:0");
    }
    
    let account_comments: Vec<AccountComment> = sqlx::query_as("SELECT * FROM acc_comments WHERE account_id = $1 ORDER BY timestamp DESC LIMIT 10 OFFSET $2")
        .bind(&form.account_id)
        .bind(form.page.clone() * 10)
        .fetch_all(db.get_ref())
        .await.unwrap();

    let mut result: String = String::new();

    for account_comment in account_comments.iter() {
        let relative_timestamp: String = relative_timestamp(account_comment.timestamp.clone() as u64);

        result += &format!("2~{}~3~{}~4~{}~5~0~6~{}~7~0~8~{}~9~{}|", account_comment.comment, account_comment.account_id, account_comment.likes, account_comment.account_comment_id, account_comment.account_id, relative_timestamp);
    }

    result.pop();

    result += &format!("#{}:{}:10", comments_count.0, form.page.clone() * 10);

    HttpResponse::Ok().body(result)
}