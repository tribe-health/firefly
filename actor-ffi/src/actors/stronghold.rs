use super::Event;
use chronicle_common::actor;
use tokio::sync::mpsc::UnboundedReceiver;

actor!(StrongholdBuilder {
  rx: UnboundedReceiver<Event>
});

impl StrongholdBuilder {
  pub fn build(self) -> Stronghold {
    Stronghold {
      rx: self.rx.expect("rx is required"),
    }
  }
}

pub struct Stronghold {
  rx: UnboundedReceiver<Event>,
}

impl Stronghold {
  pub async fn run(mut self) {
    println!("running stronghold actor");

    while let Some(event) = self.rx.recv().await {
      println!("stronghold got message: {}", event.message);
      event.response_tx.send("response".to_string()).unwrap();
    }

    println!("finished actor");
  }
}
