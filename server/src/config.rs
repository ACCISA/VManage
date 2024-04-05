use serde::{Deserialize, Serialize};
use serde_json::to_string;
use std::fs;
use std::fs::File;
use std::io::Read;
use std::path::Path;
use tracing::info;

#[derive(Serialize, Deserialize, Debug)]
pub struct Settings {
    pub path: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Machine {
    pub name: String,
    pub path: String,
    pub ip: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub settings: Settings,
    pub machines: Vec<Machine>,
}

fn is_vmrun(path: &str) -> bool {
    let file_path = Path::new(path);
    if let Some(file_name) = file_path.file_name() {
        if let Some(file_str) = file_name.to_str() {
            return file_str == "vmrun" || file_str == "vmrun.exe";
        }
    }
    return false;
}


fn file_exists(file_path: String) -> bool {
    if let Ok(metadata) = fs::metadata(file_path) {
        if metadata.is_file() {
            info!("File exists.");
            return true;
        } else {
            info!("The path exists but is not a file.");
            return false;
        }
    } else {
        info!("File does not exist.");
        return false;
    }
}

pub fn validate_vmware(vmware_path: String) -> bool {
    if file_exists(vmware_path) && is_vmrun(&vmware_path) {
        return true;
    }
    return false;
}

pub fn read_config() -> Config {
    
    let config_path = "data.json";
    let mut file = File::open(config_path).expect("Failed to open file");

    let mut json_data = String::new();
    file.read_to_string(&mut json_data)
        .expect("Failed to read file");

    let config: Config = serde_json::from_str(&json_data).expect("Failed to deserialize");

    return config;

}