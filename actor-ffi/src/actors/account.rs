use super::{send_to, Actor, Event};
use chronicle_common::actor;
use tokio::sync::mpsc::UnboundedReceiver;

actor!(AccountBuilder {
    rx: UnboundedReceiver<Event>
});

impl AccountBuilder {
    pub fn build(self) -> Account {
        Account {
            rx: self.rx.expect("rx is required"),
        }
    }
}

pub struct Account {
    rx: UnboundedReceiver<Event>,
}

impl Account {
    pub async fn run(mut self) {
        println!("running account actor");

        while let Some(event) = self.rx.recv().await {
            println!("Account got message: {}", event.message);

            let stronghold_response =
                send_to(Actor::Stronghold, "message from Account actor".to_string())
                    .await
                    .unwrap();
            println!("stronghold response: {:?}", stronghold_response);

            event
                .response_tx
                .send(r#"{ "response": 5 }"#.to_string())
                .unwrap();
        }

        println!("finished actor");
    }
}
