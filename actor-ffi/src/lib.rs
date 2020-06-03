use bastion::prelude::*;
use std::sync::Arc;
use once_cell::sync::Lazy;

fn wallet_actor(children: Children) -> Children {
    children
        .with_redundancy(1)
        .with_exec(|ctx: BastionContext| {
            async move {
                // This macro is weird.
                // Bear with me as I tell you more
                // about the variants in the match statements below.
                // so the first line means "wait for the next message", and then lets match against it
                msg! { ctx.recv().await?,
                    // ref <name> are broadcasts.
                    // =!> refer to messages that can be replied to.
                    msg: String =!> {
                        answer!(ctx, String::from("answer message")).expect("failed to answer");
                    };
                    _: _ => ();
                }

                // ...

                Ok(())
            }
        })
}

fn send_message_internal<F: 'static + Fn(String) + Send + Sync>(children: Children, to: ChildRef, message: &'static str, callback: F) -> Children {
    let to = Arc::new(to);
    let callback = Arc::new(callback);
    children
        .with_redundancy(1)
        .with_exec(move |ctx: BastionContext| {
            let to = to.clone();
            let callback = callback.clone();
            async move {
                let answer = ctx
                    .ask(&to.addr(), message.to_string())
                    .expect("failed to ask");
                msg! { answer.await?,
                    msg: String => {
                        callback(msg);
                    };
                    _: _ => ();
                }
                Ok(())
            }
        })
}

struct System {
    pub supervisor: SupervisorRef,
    pub wallet_actor_ref: ChildrenRef,
}

fn init_system() -> System {
    Bastion::init();
    Bastion::start();

    let supervisor = Bastion::supervisor(|sp| sp.with_strategy(SupervisionStrategy::OneForAll))
        .expect("failed to create supervisor");
    let wallet_actor_ref = Bastion::children(|children| wallet_actor(children))
        .expect("failed to create wallet actor");

    System {
        supervisor,
        wallet_actor_ref,
    }
}

fn get_system() -> &'static System {
    static SYSTEM: Lazy<System> = Lazy::new(|| init_system());

    &SYSTEM
}

pub fn send_message<F: 'static + Fn(String) + Send + Sync>(message: &'static str, callback: F) {
    let system = get_system();
    system.supervisor
        .children(move |children| {
            send_message_internal(children, system.wallet_actor_ref.elems()[0].clone(), message, callback)
        })
        .expect("failed to create message actor");
    // TODO remove this
    Bastion::block_until_stopped();
}
