use chronicle_common::launcher;

mod actors;
use actors::{send_to, Actor, WalletBuilder};

launcher!(
    apps_builder: AppsBuilder {wallet: WalletBuilder}, // Apps
    apps: Apps {} // Launcher state
);

// build your apps
impl AppsBuilder {
    fn build(self) -> Apps {
        let wallet = WalletBuilder::new();
        self.wallet(wallet).to_apps()
    }
}

pub async fn init() {
    println!("Starting runtime");
    AppsBuilder::new()
        .build() // build apps first, then start them in order you want.
        .wallet()
        .await // start app
        .one_for_one()
        .await;
}

pub async fn send_message(message: String) -> String {
    // loop to make sure the runtime has been initialized before sending messages
    loop {
        match send_to(Actor::Account, message.clone()).await {
            Ok(response) => {
                return response.unwrap_or("".to_string());
            }
            Err(_) => {}
        }
    }
}
