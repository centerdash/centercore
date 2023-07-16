use std::time::{SystemTime, UNIX_EPOCH};

use actix_web::{Responder, HttpResponse, post, web::{Data, Form}};
use bcrypt::{hash, DEFAULT_COST};
use serde::Deserialize;
use sqlx::{PgPool, postgres::PgRow};

#[derive(Debug, Deserialize)]
struct Body {
    #[serde(rename = "userName")]
    username: String,
    password: String,
    email: String,
}

#[post("/accounts/registerGJAccount.php")]
async fn handler(form: Form<Body>, db: Data<PgPool>) -> impl Responder {
    if form.username.trim().is_empty() || form.username.trim().len() > 20 {
        return HttpResponse::Ok().body("-1");
    }

    let username_check: Option<PgRow> = sqlx::query("SELECT 1 FROM accounts WHERE username = $1")
        .bind(&form.username)
        .fetch_optional(db.get_ref())
        .await.unwrap();

    if !username_check.is_none() {
        return HttpResponse::Ok().body("-2");
    }

    let timestamp: f64 = SystemTime::now()
        .duration_since(UNIX_EPOCH).unwrap()
        .as_secs_f64();
    
    let password_hash: String = hash(form.password.to_owned(), DEFAULT_COST).unwrap();

    sqlx::query("INSERT INTO accounts (username, password, email, timestamp) VALUES ($1, $2, $3, $4)")
        .bind(&form.username)
        .bind(&password_hash)
        .bind(&form.email)
        .bind(&timestamp)
        .execute(db.get_ref())
        .await.unwrap();

    HttpResponse::Ok().body("1")
}