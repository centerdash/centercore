use actix_web::{Responder, HttpResponse, post, web::{Form, Data}};
use serde::Deserialize;
use sqlx::PgPool;

use crate::{models::account::Account, utils::encryption};

#[derive(Debug, Deserialize)]
pub struct Body {
    #[serde(rename = "accountID")]
    account_id: i64,
    gjp: String,
    #[serde(rename = "mS")]
    ms: i64,
    #[serde(rename = "frS")]
    frs: i64,
    #[serde(rename = "cS")]
    cs: i64,
    yt: String,
    twitter: String,
    twitch: String,
}

#[post("/updateGJAccSettings20.php")]
pub async fn handler(form: Form<Body>, db: Data<PgPool>) -> impl Responder {
    if form.ms < 0 || form.ms > 2 || form.frs < 0 || form.frs > 1 || form.cs < 0 || form.cs > 2 {
        return HttpResponse::Ok().body("-1");
    }

    if form.yt.chars().count() != 24 && form.yt.chars().count() != 0 {
        return HttpResponse::Ok().body("-1");
    }

    if form.twitter.chars().count() > 15 {
        return HttpResponse::Ok().body("-1");
    }

    if form.twitch.chars().count() > 25 {
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

    sqlx::query("UPDATE accounts SET ms = $1, frs = $2, cs = $3, youtube = $4, twitter = $5, twitch = $6 WHERE account_id = $7")
        .bind(&form.ms)
        .bind(&form.frs)
        .bind(&form.cs)
        .bind(&form.yt)
        .bind(&form.twitter)
        .bind(&form.twitch)
        .bind(&form.account_id)
        .execute(db.get_ref())
        .await.unwrap();

    HttpResponse::Ok().body("1")
}