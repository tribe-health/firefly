<script>
  import { onMount } from 'svelte'
  import { wallet, isCreatingAccount } from './state';

  const {
    onMessage,
    createAccount,
    setStrongholdPassword,
    backup,
    restoreBackup,
    getAccount,
    syncAccounts,
    removeAccount
  } = window.__WALLET__;

  onMount(() => {
    // Delete existing stronghold db
    window.__deleteStrongholdSnapshot();

    onMessage(processMessage);

    // Setup stronghold
    setStrongholdPassword("password");

    console.info('__WALLET__', window.__WALLET__);
  });

  function processMessage(message) {
    console.log('Message: ', message);

    if (message.type === 'CreatedAccount') {
      isCreatingAccount.set(false);
      wallet.update((_wallet) => Object.assign({}, _wallet, {
        accounts: [..._wallet.accounts, message.payload]
      }))
    }
  }

  function createNewAccount() {
    isCreatingAccount.set(true);

    createAccount({
      clientOptions: {
        node: "http://178.254.38.18:14267"
      },
      alias: 'foo',
    });
  }
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #000000;
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
  <h1>Desktop wallet!</h1>
  <button on:click={createNewAccount}>{$isCreatingAccount ? 'Creating account...' : 'Create Account'}</button>
  <ul>
    {#each $wallet.accounts as account}
      <li>
        {account.alias} — {account.created_at}
        <button on:click={() => removeAccount(account.id)}>Remove</button>
      </li>
    {/each}
  </ul>
</main>
