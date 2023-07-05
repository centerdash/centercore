use std::env;

use actix_web::{App, HttpServer, web::Data};
use mongodb::{Client, Database};
use dotenv::dotenv;

mod routes;
mod models;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let mongo_uri: String = env::var("MONGO_URI").expect("MONGO_URI not found in your .env");
    let mongo_db: String = env::var("MONGO_DB").expect("MONGO_DB not found in your .env");

    let mongo_client: Client = Client::with_uri_str(mongo_uri).await.unwrap();
    let db: Database = mongo_client.database(mongo_db.as_str());
    let db_data: Data<Database> = Data::new(db);

    HttpServer::new(move || {
        App::new()
            .app_data(db_data.clone())
            .service(routes::accounts::register::handler)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}