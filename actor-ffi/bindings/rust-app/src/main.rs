use wallet_actor_system::{init as init_runtime, send_message as send_actor_message};

#[smol_potat::main]
async fn main() {
    std::thread::spawn(|| smol::block_on(init_runtime()));
    for _ in 1..100000 {
        let response = send_actor_message("message from Rust".to_string()).await;
        println!("{}", response);
    }
}
