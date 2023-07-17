use actix_web::{Responder, HttpResponse, post, web::{Form, Data}};
use serde::Deserialize;
use sqlx::PgPool;

use crate::{models::account::Account, utils::encryption};

#[derive(Debug, Deserialize)]
pub struct Body {
    #[serde(rename = "accountID")]
    account_id: i64,
    gjp: String,
}

#[post("/requestUserAccess.php")]
pub async fn handler(form: Form<Body>, db: Data<PgPool>) -> impl Responder {
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

    let moderator: i32 = account_data.moderator;

    if moderator == 0 {
        HttpResponse::Ok().body("-1")
    } else if moderator == 1 {
        HttpResponse::Ok().body("1")
    } else if moderator == 2 {
        HttpResponse::Ok().body("2")
    } else {
        HttpResponse::Ok().body("-1")
    }
}