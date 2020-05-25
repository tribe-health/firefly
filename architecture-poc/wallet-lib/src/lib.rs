use iota::bundle::{Address, TransactionField};
use iota::crypto::Kerl;
use iota::signing::{
    IotaSeed, PrivateKey, PrivateKeyGenerator, PublicKey, Seed, WotsPrivateKeyGeneratorBuilder,
    WotsSecurityLevel,
};
use iota::ternary::{T1B1Buf, TryteBuf};
use iota_conversion::Trinary;

use wasm_bindgen::prelude::*;

use serde::Serialize;

fn js_error<T: std::fmt::Debug>(e: T) -> JsValue {
    JsValue::from(format!("{:?}", e))
}

fn get_seed(seed: String) -> Result<IotaSeed<Kerl>, JsValue> {
    let seed = IotaSeed::<Kerl>::from_buf(
        TryteBuf::try_from_str(&seed)
        .map_err(js_error)?
        .as_trits()
        .encode::<T1B1Buf>()
    ).map_err(js_error)?;
    Ok(seed)
}

fn response_to_js_value<T: Serialize>(response: T) -> Result<JsValue, JsValue> {
    JsValue::from_serde(&response)
        .map_err(js_error)
}

#[wasm_bindgen(js_name = "generateAddress")]
pub fn generate_address(seed: String) -> Result<JsValue, JsValue> {
    let seed = get_seed(seed)?;

    let address: Address = Address::try_from_inner(
        WotsPrivateKeyGeneratorBuilder::<Kerl>::default()
            .security_level(WotsSecurityLevel::Medium)
            .build()
            .unwrap()
            .generate(&seed, 3)
            .unwrap()
            .generate_public_key()
            .unwrap()
            .trits()
            .to_owned(),
    )
    .map_err(js_error)?;

    let address_trytes = address.to_inner().as_i8_slice().trytes()
        .map_err(js_error)?;
    let response = response_to_js_value(address_trytes)?;
    Ok(response)
}
