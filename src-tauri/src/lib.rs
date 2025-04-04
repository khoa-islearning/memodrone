#[cfg_attr(mobile, tauri::mobile_entry_point)]
use tauri::Manager;
use std::process::Command;

pub fn run() {
    let mut node_process = Command::new("node")
    .arg("../backend/dist/server.js") // Path to your server.js file
    .spawn()
    .expect("Failed to start Node.js server");

  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
    
        node_process.wait().expect("Node.js server exited unexpectedly");

}
