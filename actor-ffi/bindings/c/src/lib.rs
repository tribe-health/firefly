use std::ffi::{CStr, CString};
use std::os::raw::c_char;

use wallet_actor_system::{send_message as send_actor_message};

type Callback = fn(*const c_char);

#[no_mangle]
pub extern "C" fn send_message(message: *const c_char, callback: Callback) {
    let c_message = unsafe {
        assert!(!message.is_null());
        CStr::from_ptr(message)
    };
    let message = c_message.to_str().unwrap();
    send_actor_message(message, move |response| {
        let c_response = CString::new(response).expect("failed to convert response to CString");
        unsafe {
            callback(c_response.as_ptr());
        }
    });
}
