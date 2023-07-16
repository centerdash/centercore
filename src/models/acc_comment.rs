use sqlx::FromRow;

#[derive(Debug, FromRow)]
pub struct AccountComment {
    pub account_comment_id: i32,
    pub account_id: i32,
    pub comment: String,
    pub likes: i32,
    pub timestamp: i32,
}