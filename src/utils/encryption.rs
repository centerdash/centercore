use base64::{engine::general_purpose, Engine};
use bcrypt::verify;

fn xor(s: Vec<u8>, key: &[u8]) -> Vec<u8> {
    let mut b = key.iter().cycle();
    s.into_iter().map(|x| x ^ b.next().unwrap()).collect()
}

fn decode_gjp(gjp: String) -> String {
    let decoded_base64: Vec<u8> = general_purpose::STANDARD.decode(gjp).unwrap();
    let decoded_xor: Vec<u8> = xor(decoded_base64.clone(), "37526".as_bytes());

    String::from_utf8(decoded_xor).unwrap()
}

pub fn verify_gjp(password_hash: String, gjp: String) -> bool {
    let decoded_gjp: String = decode_gjp(gjp);

    verify(decoded_gjp, password_hash.as_str()).unwrap()
}