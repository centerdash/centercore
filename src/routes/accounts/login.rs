use actix_web::{Responder, HttpResponse, post, web::{self, Data}};
use bcrypt::verify;
use serde::Deserialize;
use sqlx::PgPool;

use crate::models::account::Account;

#[derive(Debug, Deserialize)]
pub struct Body {
    #[serde(rename = "userName")]
    username: String,
    password: String,
}

#[post("/accounts/loginGJAccount.php")]
pub async fn handler(form: web::Form<Body>, db: Data<PgPool>) -> impl Responder {
    if form.username.trim().is_empty() || form.username.trim().len() > 20 {
        return HttpResponse::Ok().body("-1");
    }

    let account: Option<Account> = sqlx::query_as::<_, Account>("SELECT * FROM accounts WHERE username = $1")
        .bind(&form.username)
        .fetch_optional(db.as_ref())
        .await.unwrap();

    if account.is_none() {
        return HttpResponse::Ok().body("-1");
    }

    let account_data: Account = account.unwrap();

    if !verify(form.password.to_owned(), account_data.password.as_str()).unwrap() {
        return HttpResponse::Ok().body("-1");
    }

    let account_id: i32 = account_data.account_id;
    HttpResponse::Ok().body(format!("{},{}", account_id, account_id))
}