use actix_web::{Responder, HttpResponse, post, web::{Data, Form}};
use serde::Deserialize;
use sqlx::PgPool;

use crate::{models::account::Account, utils::encryption};

#[derive(Debug, Deserialize)]
struct Body {
    #[serde(rename = "accountID")]
    account_id: i64,
    gjp: String,
    #[serde(rename = "commentID")]
    comment_id: i64,
}

#[post("/deleteGJAccComment20.php")]
async fn handler(form: Form<Body>, db: Data<PgPool>) -> impl Responder {
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

    sqlx::query("DELETE FROM acc_comments WHERE account_comment_id = $1 AND account_id = $2")
        .bind(&form.comment_id)
        .bind(&account_data.account_id)
        .execute(db.get_ref())
        .await.unwrap();

    HttpResponse::Ok().body("1")
}