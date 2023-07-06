use std::env;

use actix_web::{App, HttpServer, web::{Data, self}, middleware::Logger};
use mongodb::{Client, Database};
use dotenv::dotenv;

mod routes;
mod models;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let url_prefix: String = env::var("URL_PREFIX").expect("URL_PREFIX not found in your .env");
    let mongo_uri: String = env::var("MONGO_URI").expect("MONGO_URI not found in your .env");
    let mongo_db: String = env::var("MONGO_DB").expect("MONGO_DB not found in your .env");

    let mongo_client: Client = Client::with_uri_str(mongo_uri).await.unwrap();
    let db: Database = mongo_client.database(mongo_db.as_str());
    let db_data: Data<Database> = Data::new(db);

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::new("%a \"%r\" %s %b \"%{Referer}i\" \"%{User-Agent}i\" %T"))
            .app_data(db_data.clone())
            .service(
                web::scope(url_prefix.as_str())
                    .service(routes::accounts::register::handler)
                    .service(routes::accounts::login::handler)
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}