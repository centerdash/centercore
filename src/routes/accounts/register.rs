use actix_web::{Responder, HttpResponse, post};

#[post("/accounts/registerGJAccount.php")]
pub async fn handler(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}