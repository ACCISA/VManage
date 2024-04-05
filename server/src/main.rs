#![allow(unused)]

use axum::routing::get;
use serde_json::Value;
use socketioxide::{
    extract::{Data, SocketRef},
    SocketIo,
};
use tower::ServiceBuilder;
use tower_http::cors::CorsLayer;
use tracing::info;
use tracing_subscriber::FmtSubscriber;

mod config;
mod error;
// mod utils;

use config::read_config;
use config::validate_vmware;
use config::Machine;
use config::Settings;
use config::Config;

#[derive(Debug, serde::Deserialize)]
struct MessageIn {
    room: String,
    text: String,
}

async fn on_connect(socket: SocketRef) {
    info!{"socket connected: {}", socket.id}

    socket.on("message", |_socket: SocketRef, Data::<MessageIn>(data)| {
        info!("received message: {:?}", data);
    })
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing::subscriber::set_global_default(FmtSubscriber::default())?;

    let (layer, io) = SocketIo::new_layer();

    let app = axum::Router::new()
        .route("/", get(|| async { "Hellow world" }))
        .layer(
            ServiceBuilder::new()
                .layer(CorsLayer::permissive())
                .layer(layer),
        );

    info!("Server started on port 3000");
    let config: Config = read_config();
    let settings: Settings = config.settings;
    let vmware_path: String = settings.path;
    let machines: Vec<Machine> = config.machines;
    info!("Loaded settings: {:?}", settings);

    let path_status: bool = validate_vmware(vmware_path);
    if path_status {
        info!("Validated vmware_path: {:?}", vmware_path);
    } else {
        info!("Invaid vmware_path: {:?}", vmware_path)
    }
    
    info!("Loaded machines: {:?}", machines);
    axum::Server::bind(&"127.0.0.1:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await?;


    Ok(())
}