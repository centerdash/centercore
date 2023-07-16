use sqlx::FromRow;

#[derive(Debug, FromRow)]
pub struct Account {
    pub account_id: i32,
    pub username: String,
    pub password: String,
    pub email: String,
    pub timestamp: i32,
    pub stars: i32,
    pub diamonds: i32,
    pub coins: i32,
    pub user_coins: i32,
    pub demons: i32,
    pub creator_points: i32,
    pub icon: i32,
    pub icon_type: i32,
    pub acc_icon: i32,
    pub acc_ship: i32,
    pub acc_ball: i32,
    pub acc_bird: i32,
    pub acc_dart: i32,
    pub acc_robot: i32,
    pub acc_spider: i32,
    pub acc_glow: i32,
    pub acc_explosion: i32,
    pub color1: i32,
    pub color2: i32,
    pub special: i32,
    pub ms: i32,
    pub cs: i32,
    pub frs: i32,
    pub youtube: Option<String>,
    pub twitter: Option<String>,
    pub twitch: Option<String>,
}