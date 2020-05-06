/**
 * Dummy method for converting trytes to ascii
 * 
 * @method _convertToAscii
 * 
 * @param {string} trytes 
 * 
 * @returns {string}
 */
const _convertToAscii = (trytes: string) => 'Ascii';

/**
 * Dummy method for extracting a message from signature message fragment
 * 
 * @method _getMessage
 * 
 * @param {string} trytes
 * 
 * @returns {string}
 */
const _getMessage = (trytes: string) => 'Message';

/**
 * Generates random string
 * 
 * @method generateRandomString
 * 
 * @return {string}
 */
const generateRandomString = (): string => Math.random().toString(36).substring(7);

/**
 * Account configuration object
 */
type AccountConfig = {
    seed: Int8Array | string;
    security?: 1 | 2 | 3;
    alias?: string;
    network?: 'mainnet' | 'devnet' | 'comnet';
    provider?: string;
    transactions?: Transaction[];
    addresses?: Address[];
    createdAt?: Date;
};

/**
 * Transaction object with primitive types
 */
interface BaseTransactionObject {
    hash: string;
    signatureMessageFragment: string;
    address: string;
    value: number;
    tag: string;
    timestamp: number;
    currentIndex: number;
    lastIndex: number;
    bundle: string;
    trunkTransaction: string;
    branchTransaction: string;
    nonce: string;
    // Additional properties
    // ------------------------
    // Determines if the transaction is confirmed
    confirmed: boolean;
    // Determines if the transaction was broadcast to the network
    //
    // Broadcast will be true in the following scenarios:
    //   1. If the transaction was fetched from the network 
    //   2. If the transaction was successfully broadcast from the wallet itself
    //  
    // Broadcast will be false if the transaction was failed to broadcast from the wallet.
    broadcasted: boolean;
    // Determines if the transaction is incoming or outgoing
    incoming: boolean;
};

/**
 * Transaction object with custom types
 */
interface TransactionObject {
    hash: string;
    signatureMessageFragment: SignatureMessageFragment;
    address: string;
    value: Value;
    tag: Tag;
    timestamp: Timestamp;
    currentIndex: number;
    lastIndex: number;
    bundle: string;
    trunkTransaction: string;
    branchTransaction: string;
    nonce: string;
    confirmed: boolean;
    broadcasted: boolean;
    incoming: boolean;
};

/**
 * Address object
 */
type Address = {
    address: string;
    keyIndex: number;
    balance: number;
    security: 1 | 2 | 3;
    checksum: string;
};

/**
 * Account object
 */
type AccountObject = {
    id: string;
    alias: string;
    addresses: Address[];
    transactions: Transaction[];
    createdAt: Date;
    lastSyncedAt?: Date;
};

/**
 * Transfer object
 */
type Transfer = {
    amount: number;
    address: string;
    tag?: string;
    message?: string;
};

/**
 * Synced account object
 */
interface SyncedAccount extends AccountObject {
    depositAddress: Address;
    send(): any;
    retry(): any;
};

/**
 * Adapter object
 */
type Adapter = {
    get(key: string): Promise<any>;
    getAll(): Promise<any>;
    set(key: string, payload: any): Promise<any>;
    remove(key: string): Promise<any>;
};

/**
 * Class for managing Transaction.tag
 */
class Tag {
    private _tag: string;

    constructor(tag: string) {
        this._tag = tag;
    }

    /**
     * Gets tag as trytes
     * 
     * @method asTrytes
     * 
     * @returns {string}
     */
    asTrytes(): string {
        return this._tag;
    }

    /**
     * Gets tag as ascii
     * 
     * @method asAscii
     * 
     * @returns {string}
     */
    asAscii(): string {
        return _convertToAscii(this._tag);
    }
};

/**
 * Class for managing Transaction.timestamp
 */
class Timestamp {
    private _timestamp: number;

    constructor(timestamp: number) {
        this._timestamp = timestamp;
    }

    /**
     * Gets timestamp in unix timestamp format
     * 
     * @method asUnixTimestamp
     * 
     * @returns {number}
     */
    asUnixTimestamp(): number {
        return this._timestamp;
    }

    /**
     * Gets timestamp in hh-mm dd-mm-yyyy format
     * 
     * @method asHoursMinutesDayMonthYear
     * 
     * @returns {string}
     */
    asHoursMinutesDayMonthYear(): string {
        return new Date(this._timestamp).toISOString();
    }

    /**
     * Gets timestamp in mm-ss dd-mm-yyyy format
     * 
     * @method asHoursMinutesSecondsDayMonthYear
     * 
     * @returns {string}
     */
    asHoursMinutesSecondsDayMonthYear(): string {
        return new Date(this._timestamp).toISOString();
    }

    /**
     * Gets timestamp in dd-mm yyyy-hh-mm format
     * 
     * @method asDayMonthYearHoursMinutes
     * 
     * @returns {string}
     */
    asDayMonthYearHoursMinutes(): string {
        return new Date(this._timestamp).toISOString();
    }
};

/**
 * Class for managing Transaction.value
 */
class Value {
    private _value: number;

    constructor(value: number) {
        this._value = value;
    }

    /**
     * Gets value with relevant denomination
     * 
     * @method withDenomination
     * 
     * @returns {string}
     */
    withDenomination(): string {
        return `${this._value} Ki`;
    }

    /**
     * Gets value without denomination
     * 
     * @method withoutDenomination
     * 
     * @returns {number}
     */
    withoutDenomination(): number {
        return this._value;
    }
};

/**
 * Class for managing Transaction.SignatureMessageFragment
 */
class SignatureMessageFragment {
    private _messageFragment: string;

    constructor(messageFragment: string) {
        this._messageFragment = messageFragment;
    }

    /**
     * Gets signature message fragment in trytes
     * 
     * @method getSignature
     * 
     * @returns {string}
     */
    getSignature(): string {
        return this._messageFragment;
    }

    /**
     * Extracts message from signature message fragment
     * 
     * @method getMessage
     * 
     * @returns {string}
     */
    getMessage(): string {
        return _getMessage(this._messageFragment);
    }
};

/** Class for managing Transaction */
class Transaction implements TransactionObject {
    hash: string;
    signatureMessageFragment: SignatureMessageFragment;
    address: string;
    value: Value;
    tag: Tag;
    timestamp: Timestamp;
    currentIndex: number;
    lastIndex: number;
    bundle: string;
    trunkTransaction: string;
    branchTransaction: string;
    nonce: string;
    confirmed: boolean;
    broadcasted: boolean;
    incoming: boolean;

    constructor(transaction: BaseTransactionObject) {
        this.hash = transaction.hash;
        this.address = transaction.address;
        this.currentIndex = transaction.currentIndex;
        this.lastIndex = transaction.lastIndex;
        this.bundle = transaction.bundle;
        this.trunkTransaction = transaction.trunkTransaction;
        this.branchTransaction = transaction.branchTransaction;
        this.nonce = transaction.nonce;
        this.confirmed = transaction.confirmed;
        this.broadcasted = transaction.broadcasted;
        this.incoming = transaction.incoming;

        this.signatureMessageFragment = new SignatureMessageFragment(transaction.signatureMessageFragment);
        this.value = new Value(transaction.value);
        this.tag = new Tag(transaction.tag);
        this.timestamp = new Timestamp(transaction.timestamp);
    }
}

/** Class for account management */
class Account implements AccountObject {
    private _seed: string | Int8Array;

    id: string;
    alias: string;
    addresses: Address[];
    transactions: Transaction[];
    createdAt: Date;

    /**
     * Initialisation
     * 
     * @param {AccountConfig} config 
     */
    constructor(config: AccountConfig) {
        // Store seed in secure storage
        this.alias = config.alias;
        this._seed = config.seed;

        this.id = generateRandomString();

        // If loaded from external storage, the addresses & transactions should be validated
        this.addresses = config.addresses || [];
        this.transactions = config.transactions || [];
        this.createdAt = config.createdAt || new Date();

    }

    /**
     * Returns total balance on account
     * 
     * @property totalBalance
     * 
     * @returns {number}
     */
    get totalBalance() { return this.addresses.reduce((acc, object) => (acc + object.balance), 0); }

    /**
     * Returns available balance on account
     * 
     * @property availableBalance
     * 
     * @returns {number}
     */
    get availableBalance() { return this.addresses.reduce((acc, object) => (acc + object.balance), 0); }

    /**
     * Returns all pending transactions
     * 
     * @property pendingTransactions
     * 
     * @returns {Transaction[]}
     */
    get pendingTransactions() { return []; }

    /**
     * Returns all confirmed transactions
     * 
     * @property confirmedTransactions
     * 
     * @returns {Transaction[]}
     */
    get confirmedTransactions() { return []; }

    /**
     * Returns all tail transactions
     * 
     * @property tailTransactions
     * 
     * @returns {Transaction[]}
     */
    get tailTransactions() { return []; }

    /**
     * Returns all zero value transactions
     * 
     * @property zeroValueTransactions
     * 
     * @returns {Transaction[]}
     */
    get zeroValueTransactions() { return []; }

    /**
     * Returns all value transactions
     * 
     * @property valueTransactions
     * 
     * @returns {Transaction[]}
     */
    get valueTransactions() { return []; }

    /**
     * Returns all invalid transactions
     * 
     * @property invalidTransactions
     * 
     * @returns {Transaction[]}
     */
    get invalidTransactions() { return []; }

    /**
     * Returns all input transactions
     * 
     * @property inputTransactions
     * 
     * @returns {Transaction[]}
     */
    get inputTransactions() { return []; }

    /**
     * Returns all output transactions
     * 
     * @property outputTransactions
     * 
     * @returns {Transaction[]}
     */
    get outputTransactions() { return []; }

    /**
    * Returns incoming transactions
    * 
    * @property incomingTransactions
    * 
    * @returns {Transaction[]}
    */
    get incomingTransactions() { return [] };

    /**
     * Returns outgoing transactions
     * 
     * @property outgoingTransactions
     * 
     * @returns {Transaction[]}
     */
    get outgoingTransactions() { return [] };

    /**
     * Returns spent addresses
     * 
     * @property spentAddresses
     * 
     * @returns {Address[]}
     */
    get spentAddresses() { return [] };

    /**
    * Returns unspent addresses
    * 
    * @property unspentAddresses
    * 
    * @returns {Address[]}
    */
    get unspentAddresses() { return [] };

    /**
     * Sync account with the tangle
     *   1. Generate addresses
     *   2. Get balances
     *   3. Get transactions against addresses
     *   4. Construct & validate bundles
     *   5. Populate addresses & transactions fields
     * 
     * Methods like send should only be exposed to the user after account is synced
     * 
     * @method sync
     * 
     * @returns {Promise<SyncedAccount>}
     */
    sync() {
        return Promise.resolve({
            /**
             * Sends transaction
             * 
             * @method send
             * 
             * @param {Transfer[]} transfers 
             */
            send(transfers: Transfer[]) {
                return Promise.resolve();
            },
            /**
             * Retry failed transaction
             * 
             * @method retry
             * 
             */
            retry() {
                return Promise.resolve();
            },
            /**
             * @property depositAddress
             */
            depositAddress: { address: 'XXX...XXX', keyIndex: 12, checksum: 'AAA', balance: 0, security: 2 }
        })
    }

    /**
     * Sets alias
     * 
     * @method setAlias
     * 
     * @param {string} newAlias 
     * 
     * @returns {Promise<any>}
     */
    setAlias(newAlias: string): Promise<any> {
        this.alias = newAlias;

        return Promise.resolve();
    }

    /**
     * Sends zero value transaction
     * 
     * @method sendMessage
     * 
     * @param {string} message
     * 
     * @return {Promise<any>} 
     */
    sendMessage(message: string): Promise<any> {
        return Promise.resolve();
    }
}

/** Manager class for multiple accounts management */
class AccountsManager {
    private static instance: AccountsManager;
    private _secureStorageAdapter: Adapter;
    private _externalStorageAdapter: Adapter;

    accounts: Account[];

    constructor(secureStorageAdapter: Adapter, externalStorageAdapter: Adapter) {
        if (AccountsManager.instance) {
            return AccountsManager.instance;
        }

        this._secureStorageAdapter = secureStorageAdapter;
        this._externalStorageAdapter = externalStorageAdapter;

        // Populate accounts i.e, retrieve from secure storage
        this.accounts = [] as Account[];

        AccountsManager.instance = this;
    }

    /**
     * Loads account from secure storage
     * 
     * @method load
     * 
     * @returns {Promise}
     */
    load(): Promise<Account[]> {
        return Promise.all([
            this._secureStorageAdapter.getAll(),
            this._externalStorageAdapter.getAll()
        ]).then((result) => {
            const [seeds, accountData] = result;
            this.accounts = accountData.map((account) => new Account(Object.assign({}, account, {
                seed: seeds[account.alias],
                transactions: account.transactions.map((transaction) => new Transaction(transaction))
            })))

            return this.accounts;
        });
    }

    /**
     * Adds new account
     * 
     * @method addAccount
     * 
     * @param {AccountConfig} config 
     * 
     * @returns {Promise}
     */
    addAccount(config: AccountConfig): Promise<Account> {
        const { seed, ...rest } = config;

        const alias = rest.alias || generateRandomString();

        return Promise.all([
            this._secureStorageAdapter.set(alias, seed),
            this._externalStorageAdapter.set(alias, rest)
        ]).then(() => {
            const account = new Account(config);

            this.accounts.push(account);

            return account;
        });
    }

    /**
     * Adds new account
     * 
     * @method deleteAccount
     * 
     * @param {AccountConfig} config 
     * 
     * @returns {Promise}
     */
    deleteAccount(alias: string): Promise<any> {
        return Promise.all([
            this._secureStorageAdapter.remove(alias),
            this._externalStorageAdapter.remove(alias)
        ]).then(() => {
            this.accounts.filter(account => account.alias !== alias);
        });
    }

    /**
     * Syncs all accounts with the tangle
     * 
     * @method sync
     * 
     * @returns {Promise<any[]>}
     */
    syncAccounts(): Promise<any[]> {
        return Promise.all(this.accounts.map((account) => account.sync()));
    }

    /**
     * Sends a transaction from one account to another
     * 
     * @method sendBetweenAccounts
     * 
     * @param {string} from 
     * @param {string} to
     * @param {number} amount
     * 
     * @returns {Promise} 
     */
    sendBetweenAccounts(from: string, to: string, amount: number): Promise<any> {
        return Promise.resolve();
    }
}

/**
 * Initialises accounts manager
 * 
 * @method createAccountsManager
 * 
 * @returns {Promise<AccountsManager>}
 */
export function createAccountsManager(
    secureStorageAdapter: Adapter,
    externalStorageAdapter: Adapter
) {
    const manager = new AccountsManager(secureStorageAdapter, externalStorageAdapter);

    return manager.load().then(() => manager);
}

/**
 * Mock storage for accounts
 */
const _accounts = {
    firstAccount: {
        addresses: [{
            address: 'QVMPTRCCXYHUORXY9BLOZAFGVHRMRLPWFBX9DTWEXI9CNCKRWTNAZUPECVQUHGBTVIFNAWM9GMVDGJVEB',
            balance: 0,
            keyIndex: 0,
            checksum: 'PKBRNQVCA',
            security: 2,
        },
        {
            address: 'EGESUXEIFAHIRLP9PB9YQJUPNWNWVDBEZAIYWUFKYKHTAHDHRVKSBCYYRJOUJSRBZKUTJGJIIGUGLDPVX',
            balance: 0,
            index: 1,
            checksum: 'BZIF9ZEBC',
            security: 2,
        }],
        transactions: [{
            hash: 'SATTUQCNMVTAIADHRQGC9SINCOYHDFQ9CZLTDESRKTWDJICSVLGRQVDFTHBDEACYFJURHBCLJPIBZ9999',
            signatureMessageFragment:
                'CCFDXCBDXCHDMDEAHDTCGDHDEANDTCFDCDEAJDPC9DIDTCEACDBDTC999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999',
            address: 'RRHMYUP9RNBBNAORNMNHYTLJZWXCWKOYV9TVQPGPKDNTTSTVLCXCDKDKPILANYIOPOHBTNAXZ9IUBPQCC',
            value: 0,
            obsoleteTag: '9VINITY99999999999999999999',
            timestamp: 1539992386,
            currentIndex: 0,
            lastIndex: 0,
            bundle: 'AGLVISDEBEYCZVIQFVHSSZISEZDCPKQJNQIHLQASIGHJWEJPWLHQUTPDQZUEZQIBHEDY9SRIBGJJEQQLZ',
            trunkTransaction: 'HOVKXZRJLCSJZMMRQYUNJQMHJAWBECXRKFMZERNLW9QWKIOECCLHM9REO9WHYXUXBKFK9KTOVLHYA9999',
            branchTransaction: 'GKDRBFCZVIPVBZRRBIBXYKCPUNNFITB9RP9JPBPXGIHRWFKHUYJNGLKSKHIIHXT9JUVVSIAYSKHTA9999',
            tag: 'TRINITY99999999999999999999',
            attachmentTimestamp: 1539992389860,
            attachmentTimestampLowerBound: 0,
            attachmentTimestampUpperBound: 3812798742493,
            nonce: 'OIDFG9999999999999999999999',
            confirmed: true,
            broadcasted: true,
        }],
        id: '0',
        alias: 'firstAccount',
        createdAt: new Date()
    }
};

/**
 * Mock secure storage for seeds
 */
const _seeds = {
    firstAccount: 'Y'.repeat(81)
};

/**
 * Secure storage adapter
 */
const SecureStorageAdapter = {
    get(key) {
        return Promise.resolve(_seeds[key]);
    },
    getAll() {
        return Promise.resolve(
            Object.keys(_seeds).reduce((acc, key) => {
                acc[key] = _seeds[key];

                return acc;
            }, {})
        )
    },
    set(key, payload) {
        _seeds[key] = payload;

        return Promise.resolve();
    },
    remove(key) {
        delete _seeds[key];

        return Promise.resolve();
    }
};

/**
 * External storage adapter for storing accounts
 */
const ExternalStorageAdapter = {
    get(key) {
        return Promise.resolve(_accounts[key]);
    },
    getAll() {
        return Promise.resolve(
            Object.keys(_accounts).map((key) => _accounts[key])
        )
    },
    set(key, payload) {
        _accounts[key] = payload;

        return Promise.resolve();
    },
    remove(key) {
        delete _accounts[key];

        return Promise.resolve();
    }
};

/**
 * ------------------------------------------------------------------------------------------------
 * Usage Example
 * ------------------------------------------------------------------------------------------------
 */
let accountsManager = null;

// Create accounts manager
createAccountsManager(SecureStorageAdapter, ExternalStorageAdapter).then((manager) => {
    // manager should have populated loaded existing account i.e., "firstAccount"
    accountsManager = manager;

    // Add new account
    accountsManager.addAccount({
        seed: 'X'.repeat(81),
        alias: 'Second Account'
    }).then((account) => {
        // Sync account
        // This should pull in all information related to seed from the tangle
        return account.sync().then((syncedAccount) => {
            // At this point, we can send a value transaction by using syncedAccount.send()
            // Note that this is by design i.e., enforcing users to sync their account before making a transaction
            // For zero value transactions, this is not necessary and users can simply do account.sendMessage('foo')
            return syncedAccount.send([{ amount: 1, address: 'C'.repeat(81) }]).then(() => {
                // Transaction sent to the tangle

                accountsManager.accounts.forEach((account) => {
                    // We can use/format transaction properties
                    account.transactions.forEach((transaction) => {
                        console.info('Transaction value with unit', transaction.value.withDenomination());
                        console.info('Transaction message', transaction.signatureMessageFragment.getMessage());
                        console.info('Transaction timestamp', transaction.timestamp.asDayMonthYearHoursMinutes());
                    });
                });
            });
        });
    })
});
