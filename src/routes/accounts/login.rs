use actix_web::{Responder, HttpResponse, post, web::{self, Data}};
use bcrypt::verify;
use mongodb::{Database, bson::doc};
use serde::Deserialize;
use crate::models::account::Account;

#[derive(Debug, Deserialize)]
pub struct Body {
    #[serde(rename = "userName")]
    username: String,
    password: String,
}

#[post("/accounts/loginGJAccount.php")]
pub async fn handler(form: web::Form<Body>, db: Data<Database>) -> impl Responder {
    if form.username.trim().is_empty() || form.username.trim().len() > 20 {
        return HttpResponse::Ok().body("-1");
    }
    
    let account: Option<Account> = db.collection::<Account>("accounts").find_one(doc! {
        "username": form.username.to_owned(),
    }, None).await.unwrap();

    if account.is_none() {
        return HttpResponse::Ok().body("-1");
    }

    let account_data: Account = account.unwrap();

    if !verify(form.password.to_owned(), account_data.password.as_str()).unwrap() {
        return HttpResponse::Ok().body("-1");
    }

    let account_id: usize = account_data.account_id;
    HttpResponse::Ok().body(format!("{},{}", account_id, account_id))
}