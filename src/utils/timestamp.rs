use std::time::{SystemTime, UNIX_EPOCH};

pub fn relative_timestamp(timestamp: u64) -> String {
    let duration: u64 = SystemTime::now()
        .duration_since(UNIX_EPOCH).unwrap()
        .as_secs();

    if timestamp > duration {
        return String::from("0 seconds");
    }
    
    let diff: u64 = duration - timestamp;

    let minute: u64 = 60;
    let hour: u64 = 60 * 60;
    let day: u64 = 60 * 60 * 24;
    let month: u64 = 60 * 60 * 24 * 30;
    let year: u64 = 60 * 60 * 24 * 30 * 12;

    if diff < minute {
        format!("{} seconds", diff)
    } else if diff < hour {
        if diff / minute == 1 {
            format!("{} minute", diff / minute)
        } else {
            format!("{} minutes", diff / minute)
        }
    } else if diff < day {
        if diff / hour == 1 {
            format!("{} hour", diff / hour)
        } else {
            format!("{} hours", diff / hour)
        }
    } else if diff < month {
        if diff / day == 1 {
            format!("{} day", diff / day)
        } else {
            format!("{} days", diff / day)
        }
    } else if diff < year {
        if diff / month == 1 {
            format!("{} month", diff / month)
        } else {
            format!("{} months", diff / month)
        }
    } else {
        if diff / year == 1 {
            format!("{} year", diff / year)
        } else {
            format!("{} years", diff / year)
        }
    }
}