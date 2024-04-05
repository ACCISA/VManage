use serde::{Deserialize, Serialize};
use serde_json::to_string;
use std::fs::File;
use std::io::Read;
use tracing::info;

#[derive(Serialize, Deserialize, Debug)]
struct Settings {
    path: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Machine {
    name: String,
    path: String,
    ip: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Config {
    settings: Settings,
    machines: Vec<Machine>,
}

pub fn load_machines() {
    
    let config_path = "data.json";
    
    let mut file = File::open(config_path).expect("Failed to open file");
    let mut json_data = String::new();

    file.read_to_string(&mut json_data)
        .expect("Failed to read file");

    let config: Config = serde_json::from_str(&json_data).expect("Failed to deserialize");

    info!("{:?}", config);

}