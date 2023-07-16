use std::time::{SystemTime, UNIX_EPOCH};

use actix_web::{Responder, HttpResponse, post, web::{Data, Form}};
use serde::Deserialize;
use sqlx::PgPool;

use crate::{models::account::Account, utils::encryption};

#[derive(Debug, Deserialize)]
struct Body {
    #[serde(rename = "accountID")]
    account_id: i64,
    gjp: String,
    comment: String,
}

#[post("/uploadGJAccComment20.php")]
async fn handler(form: Form<Body>, db: Data<PgPool>) -> impl Responder {
    if form.comment.trim().is_empty() || form.comment.trim().len() > 140 {
        return HttpResponse::Ok().body("-1");
    }

    let account: Option<Account> = sqlx::query_as("SELECT * FROM accounts WHERE account_id = $1")
        .bind(&form.account_id)
        .fetch_optional(db.get_ref())
        .await.unwrap();

    if account.is_none() {
        return HttpResponse::Ok().body("-1");
    }

    let account_data: Account = account.unwrap();

    if !encryption::verify_gjp(account_data.password, form.gjp.clone()) {
        return HttpResponse::Ok().body("-1");
    }

    let timestamp: f64 = SystemTime::now()
        .duration_since(UNIX_EPOCH).unwrap()
        .as_secs_f64();

    sqlx::query("INSERT INTO acc_comments (account_id, comment, timestamp) VALUES ($1, $2, $3)")
        .bind(&account_data.account_id)
        .bind(&form.comment)
        .bind(&timestamp)
        .execute(db.get_ref())
        .await.unwrap();

    HttpResponse::Ok().body("1")
}