<script>
  let response;
  import { Plugins } from "@capacitor/core";
  const { WalletPlugin } = Plugins;
  WalletPlugin.sendMessage("message from Capacitor demo").then(res => {
    response = JSON.stringify(res);
  });
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <h1>Response {response}!</h1>
</main>
