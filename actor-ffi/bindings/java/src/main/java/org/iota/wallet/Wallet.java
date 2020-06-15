package org.iota.wallet;

public class Wallet {
    public static void init() {
      WalletNative.INSTANCE.init();
    }

    public static void sendMessage(String message, WalletNative.MessageCallback callback) {
      WalletNative.INSTANCE.send_message(message, callback);
    }
}
