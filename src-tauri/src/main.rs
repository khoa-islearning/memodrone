// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // let node_proc = Command::new("node").arg("backend/dist/server.js").spawn().expect("Failed to start backend");
  app_lib::run();
}
