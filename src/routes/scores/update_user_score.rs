use actix_web::{Responder, HttpResponse, post, web::{self, Data}};
use serde::Deserialize;
use sqlx::PgPool;

use crate::models::account::Account;

#[derive(Debug, Deserialize)]
pub struct Body {
    #[serde(rename = "accountID")]
    account_id: i64,
    // gjp: String,
    // stars: i64,
    // demons: i64,
    // diamonds: i64,
    // icon: i64,
    // #[serde(rename = "iconType")]
    // icon_type: i64,
    // coins: i64,
    // #[serde(rename = "userCoins")]
    // silver_coins: i64,
    // #[serde(rename = "accIcon")]
    // cube: i64,
    // #[serde(rename = "accShip")]
    // ship: i64,
    // #[serde(rename = "accBall")]
    // ball: i64,
    // #[serde(rename = "accBird")]
    // bird: i64,
    // #[serde(rename = "accDart")]
    // dart: i64,
    // #[serde(rename = "accRobot")]
    // robot: i64,
    // #[serde(rename = "accGlow")]
    // glow: i64,
    // #[serde(rename = "accSpider")]
    // spider: i64,
    // #[serde(rename = "accExplosion")]
    // explosion: i64,
}

#[post("/updateGJUserScore22.php")]
pub async fn handler(form: web::Form<Body>, db: Data<PgPool>) -> impl Responder {
    let account: Option<Account> = sqlx::query_as("SELECT * FROM accounts WHERE account_id = $1")
        .bind(&form.account_id)
        .fetch_optional(db.get_ref())
        .await.unwrap();

    if account.is_none() {
        return HttpResponse::Ok().body("-1");
    }

    let account_data: Account = account.unwrap();

    HttpResponse::Ok().body(account_data.account_id.to_string())
}