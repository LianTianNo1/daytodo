// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use tauri::Manager;

#[tauri::command]
async fn get_storage(app: tauri::AppHandle, key: String) -> Result<String, String> {
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let file_path = app_dir.join(format!("{}.json", key));

    if !file_path.exists() {
        return Ok("null".to_string());
    }

    fs::read_to_string(file_path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn set_storage(app: tauri::AppHandle, key: String, value: String) -> Result<(), String> {
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;

    let file_path = app_dir.join(format!("{}.json", key));
    fs::write(file_path, value).map_err(|e| e.to_string())
}

#[tauri::command]
async fn remove_storage(app: tauri::AppHandle, key: String) -> Result<(), String> {
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let file_path = app_dir.join(format!("{}.json", key));

    if file_path.exists() {
        fs::remove_file(file_path).map_err(|e| e.to_string())?;
    }

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            get_storage,
            set_storage,
            remove_storage
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
