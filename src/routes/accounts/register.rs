use std::time::{SystemTime, UNIX_EPOCH};

use actix_web::{Responder, HttpResponse, post, web::{self, Data}};
use bcrypt::{hash, DEFAULT_COST};
use mongodb::{Database, bson::doc};
use serde::Deserialize;
use rand::{thread_rng, Rng};
use crate::models::account::Account;

#[derive(Debug, Deserialize)]
pub struct Body {
    #[serde(rename = "userName")]
    username: String,
    password: String,
    email: String,
}

#[post("/accounts/registerGJAccount.php")]
pub async fn handler(form: web::Form<Body>, db: Data<Database>) -> impl Responder {
    if form.username.trim().is_empty() || form.username.trim().len() > 20 {
        return HttpResponse::Ok().body("-1");
    }
    
    let username_check: Option<Account> = db.collection::<Account>("accounts").find_one(doc! {
        "username": form.username.to_owned(),
    }, None).await.unwrap();

    if !username_check.is_none() {
        return HttpResponse::Ok().body("-2");
    }

    let timestamp: usize = SystemTime::now()
        .duration_since(UNIX_EPOCH).unwrap()
        .as_millis() as usize;
    let account_id: usize = timestamp + thread_rng().gen_range(0..5000);
    
    let password_hash: String = hash(form.password.to_owned(), DEFAULT_COST).unwrap();

    db.collection("accounts").insert_one(Account {
        account_id,
        username: form.username.to_owned(),
        password: password_hash,
        email: form.email.to_owned(),
        timestamp,
    }, None).await.unwrap();

    HttpResponse::Ok().body("1")
}