use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Account {
    pub account_id: usize,
    pub username: String,
    pub password: String,
    pub email: String,
    pub timestamp: usize,
}
