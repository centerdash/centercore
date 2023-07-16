use std::env;

use actix_web::{App, HttpServer, web, middleware::Logger};
use dotenv::dotenv;
use sqlx::PgPool;

mod routes;
mod models;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let url_prefix: String = env::var("URL_PREFIX").expect("URL_PREFIX not found in your .env");
    let pg_url: String = env::var("DATABASE_URL").expect("DATABASE_URL not found in your .env");

    let db: PgPool = match PgPool::connect(&pg_url).await {
        Ok(db) => {
            log::info!("Connected to database");
            db
        },
        Err(err) => {
            log::error!("Failed to connect to the database: {:?}", err);
            std::process::exit(1);
        }
    };

    sqlx::migrate!().run(&db).await.unwrap();

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .app_data(web::Data::new(db.clone()))
            .service(
                web::scope(url_prefix.as_str())
                    .service(routes::accounts::register::handler)
                    .service(routes::accounts::login::handler)
                    .service(routes::profiles::get_user_info::handler)
                    .service(routes::scores::update_user_score::handler)
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}