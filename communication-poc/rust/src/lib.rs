use wasm_bindgen::prelude::*;
use js_sys::eval;
use serde::Deserialize;

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Command {
  #[serde(rename_all = "camelCase")]
  SimpleCommand {
    arg1: String,
    arg2: i64
  },
  #[serde(rename_all = "camelCase")]
  AsyncCommand {
    arg: String,
    resolve_id: String,
    reject_id: String
  }
}

#[wasm_bindgen(raw_module = "../../../src/event-system.js")]
extern "C" {
  fn emit(event: &str, payload: String);
}

#[wasm_bindgen]
extern {
  #[wasm_bindgen(js_namespace = console)]
  pub fn log(s: &str);
  #[wasm_bindgen(js_namespace = console)]
  pub fn error(s: &str);
}

macro_rules! console_log {
  ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

macro_rules! console_error {
  ($($t:tt)*) => (error(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub fn dispatch(message: &str) -> Result<JsValue, JsValue> {
  console_log!("{}", message);
  emit("commandCall", message.to_string());
  use Command::*;
  match serde_json::from_str(message) {
    Err(e) => {
      let msg = format!("{}", e.to_string());
      console_error!("{}", msg);
      Err(JsValue::from(msg))
    },
    Ok(command) => {
      match command {
        SimpleCommand {
          arg1,
          arg2
        } => {
          console_log!("SimpleCommand call with {} {}", arg1, arg2);
          Ok(JsValue::from("return value"))
        }
        AsyncCommand {
          arg,
          resolve_id,
          reject_id
        } => {
          console_log!("AsyncCommand call with {}, resolve_id {} and reject_id {}", arg, resolve_id, reject_id);
          if arg == "" {
            eval(&format!(r#"window['{}']("{}")"#, reject_id, "arg can't be empty"))
          } else {
            eval(&format!("window['{}']()", resolve_id))
          }
        }
      }
    }
  }
}