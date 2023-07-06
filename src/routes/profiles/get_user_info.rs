use actix_web::{Responder, HttpResponse, post, web::{self, Data}};
use mongodb::{Database, bson::doc};
use serde::Deserialize;
use crate::models::account::Account;

#[derive(Debug, Deserialize)]
pub struct Body {
    #[serde(rename = "targetAccountID")]
    target_account_id: usize,
    #[serde(rename = "accountID")]
    account_id: usize,
}

#[post("/getGJUserInfo20.php")]
pub async fn handler(form: web::Form<Body>, db: Data<Database>) -> impl Responder {
    let account: Option<Account> = db.collection::<Account>("accounts").find_one(doc! {
        "accountID": form.target_account_id.to_owned() as i32,
    }, None).await.unwrap();

    if account.is_none() {
        return HttpResponse::Ok().body("-1");
    }

    let account_data: Account = account.unwrap();

    HttpResponse::Ok().body(format!("1:{}:2:{}:3:{}:4:0:6:1:7:{}", account_data.username, account_data.account_id, account_data.stars, account_data.account_id))
}