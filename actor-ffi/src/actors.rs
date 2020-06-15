use once_cell::sync::OnceCell;
use tokio::sync::mpsc::{unbounded_channel, UnboundedSender};

mod account;
use account::AccountBuilder;
mod stronghold;
use stronghold::StrongholdBuilder;

static ACCOUNT_TX: OnceCell<UnboundedSender<Event>> = OnceCell::new();
static STRONGHOLD_TX: OnceCell<UnboundedSender<Event>> = OnceCell::new();

pub struct Event {
  message: String,
  response_tx: UnboundedSender<String>,
}

impl Event {
  pub fn new(message: String, response_tx: UnboundedSender<String>) -> Self {
    Self {
      message,
      response_tx,
    }
  }
}

use chronicle_common::app;

app!(WalletBuilder {});

impl WalletBuilder {
  pub fn build(self) -> Wallet {
    Wallet {}
  }
}

pub struct Wallet;

impl Wallet {
  pub async fn run(self) {
    let (account_tx, account_rx) = unbounded_channel();
    let account = AccountBuilder::new().rx(account_rx).build();
    store_actor_tx(Actor::Account, account_tx);

    let (stronghold_tx, stronghold_rx) = unbounded_channel();
    let stronghold = StrongholdBuilder::new().rx(stronghold_rx).build();
    store_actor_tx(Actor::Stronghold, stronghold_tx);

    tokio::spawn(account.run());
    tokio::spawn(stronghold.run());
  }
}

pub enum Actor {
  Account,
  Stronghold,
}

fn store_actor_tx(actor: Actor, tx: UnboundedSender<Event>) {
  let tx_cell = match actor {
    Actor::Account => &ACCOUNT_TX,
    Actor::Stronghold => &STRONGHOLD_TX,
  };
  tx_cell.set(tx).unwrap();
}

pub(crate) async fn send_to(actor: Actor, message: String) -> Result<Option<String>, String> {
  let actor_tx_opt = match actor {
    Actor::Account => ACCOUNT_TX.get(),
    Actor::Stronghold => STRONGHOLD_TX.get(),
  };
  if let Some(actor_tx) = actor_tx_opt {
    let (response_tx, mut response_rx) = unbounded_channel();
    actor_tx
      .send(Event::new(message, response_tx))
      .map_err(|e| e.to_string())?;
    Ok(response_rx.recv().await)
  } else {
    Err("actor tx not initialized".to_string())
  }
}
