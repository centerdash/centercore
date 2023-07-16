use actix_web::{Responder, HttpResponse, post, web::{self, Data}};
use serde::Deserialize;
use sqlx::PgPool;

use crate::{models::account::Account, utils::encryption};

#[derive(Debug, Deserialize)]
pub struct Body {
    #[serde(rename = "accountID")]
    account_id: i64,
    gjp: String,
    stars: i64,
    demons: i64,
    diamonds: i64,
    icon: i64,
    #[serde(rename = "iconType")]
    icon_type: i64,
    coins: i64,
    #[serde(rename = "userCoins")]
    user_coins: i64,
    #[serde(rename = "accIcon")]
    acc_icon: i64,
    #[serde(rename = "accShip")]
    acc_ship: i64,
    #[serde(rename = "accBall")]
    acc_ball: i64,
    #[serde(rename = "accBird")]
    acc_bird: i64,
    #[serde(rename = "accDart")]
    acc_dart: i64,
    #[serde(rename = "accRobot")]
    acc_robot: i64,
    #[serde(rename = "accGlow")]
    acc_glow: i64,
    #[serde(rename = "accSpider")]
    acc_spider: i64,
    #[serde(rename = "accExplosion")]
    acc_explosion: i64,
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

    if !encryption::verify_gjp(account_data.password, form.gjp.clone()) {
        return HttpResponse::Ok().body("-1");
    }

    sqlx::query("UPDATE accounts SET stars = $1, demons = $2, diamonds = $3, icon = $4, icon_type = $5, coins = $6, user_coins = $7, acc_icon = $8, acc_ship = $9, acc_ball = $10, acc_bird = $11, acc_dart = $12, acc_robot = $13, acc_glow = $14, acc_spider = $15, acc_explosion = $16 WHERE account_id = $17")
        .bind(&form.stars)
        .bind(&form.demons)
        .bind(&form.diamonds)
        .bind(&form.icon)
        .bind(&form.icon_type)
        .bind(&form.coins)
        .bind(&form.user_coins)
        .bind(&form.acc_icon)
        .bind(&form.acc_ship)
        .bind(&form.acc_ball)
        .bind(&form.acc_bird)
        .bind(&form.acc_dart)
        .bind(&form.acc_robot)
        .bind(&form.acc_glow)
        .bind(&form.acc_spider)
        .bind(&form.acc_explosion)
        .bind(&form.account_id)
        .execute(db.get_ref())
        .await.unwrap();

    HttpResponse::Ok().body(account_data.account_id.to_string())
}