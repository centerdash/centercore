use actix_web::{Responder, HttpResponse, post, web::{Form, Data}};
use serde::Deserialize;
use sqlx::PgPool;

use crate::models::account::Account;

#[derive(Debug, Deserialize)]
pub struct Body {
    #[serde(rename = "targetAccountID")]
    target_account_id: i64,
    // #[serde(rename = "accountID")]
    // account_id: i64,
}

#[post("/getGJUserInfo20.php")]
pub async fn handler(form: Form<Body>, db: Data<PgPool>) -> impl Responder {
    let account: Option<Account> = sqlx::query_as("SELECT * FROM accounts WHERE account_id = $1")
        .bind(&form.target_account_id)
        .fetch_optional(db.get_ref())
        .await.unwrap();

    if account.is_none() {
        return HttpResponse::Ok().body("-1");
    }

    let account_data: Account = account.unwrap();

    let global_rank: (i64,) = sqlx::query_as("SELECT count(*) FROM accounts WHERE stars > $1 AND account_id != $2")
        .bind(&account_data.stars)
        .bind(&form.target_account_id)
        .fetch_one(db.get_ref())
        .await.unwrap();

    HttpResponse::Ok().body(format!("1:{}:2:{}:3:{}:4:{}:6:{}:7:{}:8:{}:9:{}:10:{}:11:{}:13:{}:14:{}:15:{}:16:{}:17:{}:18:{}:19:{}:20:{}:21:{}:22:{}:23:{}:24:{}:25:{}:26:{}:28:{}:29:1:30:{}:31:0:38:0:39:0:40:0:41:0:43:{}:44:{}:45:{}:46:{}:48:{}:49:0:50:{}", account_data.username, account_data.account_id, account_data.stars, account_data.demons, global_rank.0, account_data.account_id, account_data.creator_points, account_data.icon, account_data.color1, account_data.color2, account_data.coins, account_data.icon_type, account_data.special, account_data.account_id, account_data.user_coins, account_data.ms, account_data.frs, account_data.youtube.unwrap_or(String::new()), account_data.acc_icon, account_data.acc_ship, account_data.acc_ball, account_data.acc_bird, account_data.acc_dart, account_data.acc_robot, account_data.acc_glow, global_rank.0, account_data.acc_spider, account_data.twitter.unwrap_or(String::new()), account_data.twitch.unwrap_or(String::new()), account_data.diamonds, account_data.acc_explosion, account_data.cs))
}