module.exports = {
  // default applies to all environments
  default: {
    // Blockchain node to deploy the contracts
    deployment: {
      host: "localhost", // Host of the blockchain node
      port: 8545, // Port of the blockchain node
      type: "rpc" // Type of connection (ws or rpc),
      // Accounts to use instead of the default account to populate your wallet
      /*,accounts: [
        {
          privateKey: "your_private_key",
          balance: "5 ether"  // You can set the balance of the account in the dev environment
                              // Balances are in Wei, but you can specify the unit with its name
        },
        {
          privateKeyFile: "path/to/file", // Either a keystore or a list of keys, separated by , or ;
          password: "passwordForTheKeystore" // Needed to decrypt the keystore file
        },
        {
          mnemonic: "12 word mnemonic",
          addressIndex: "0", // Optionnal. The index to start getting the address
          numAddresses: "1", // Optionnal. The number of addresses to get
          hdpath: "m/44'/60'/0'/0/" // Optionnal. HD derivation path
        }
      ]*/
    },
    // order of connections the dapp should connect to
    dappConnection: [
      "$WEB3",  // uses pre existing web3 object if available (e.g in Mist)
      "ws://localhost:8546",
      "http://localhost:8545"
    ],
    gas: "auto",
    contracts: {
      EtherPost : {
      }
    }
  },

  // default environment, merges with the settings in default
  // assumed to be the intended environment by `embark run`
  development: {
    gas: "8000000",
    dappConnection: [
      "ws://localhost:8546",
      "http://localhost:8545",
      "$WEB3"  // uses pre existing web3 object if available (e.g in Mist)
    ],
    contracts: {
      EtherPost : {
        args: []
        ,
        onDeploy: [
         "EtherPost.methods.register('abcoathup').send({from: '0xf09324e7a1e2821c2f7a4a47675f9cf0b1a5eb7f'})",
         "EtherPost.methods.register('flexdapps').send({from: '0xfbaf82a227dcebd2f9334496658801f63299ba24'})",
         "EtherPost.methods.upload('0xad9766f01697840a5b1dd2c9123bc9c5bd0b69f5fccd78cd2ca55a59e46193b8').send({from: '0xf09324e7a1e2821c2f7a4a47675f9cf0b1a5eb7f', gasLimit:1500000})",
         "EtherPost.methods.upload('0xf0d980a7c254f81bc1eaadedf0cb24aa5474b6319b1eb0327caa98257c55bce9').send({from: '0xfbaf82a227dcebd2f9334496658801f63299ba24', gasLimit:1500000})",
         "EtherPost.methods.upload('0x7c39737b03f7e04f8211e0a930602fc3bb415cd2824929dfad17823d7bdabd0d').send({from: '0xf09324e7a1e2821c2f7a4a47675f9cf0b1a5eb7f', gasLimit:1500000})",
         "EtherPost.methods.upload('0x18a5b1a24bfb8e58ee1fbfd1fefc4d9b99ffd121294b8cf3617ccf9fe1ca170d').send({from: '0xf09324e7a1e2821c2f7a4a47675f9cf0b1a5eb7f', gasLimit:1500000})",
         "EtherPost.methods.upload('0xcd4bfba457708ca1cd075c86bb094fae0c413c81165b1bd6c1f62d9ad02c2eba').send({from: '0xf09324e7a1e2821c2f7a4a47675f9cf0b1a5eb7f', gasLimit:1500000})",
         "EtherPost.methods.upload('0x1063db4d181daa1fa3e2e37a5d0ad36ad82bba86920699a222f010fb81409c00').send({from: '0xfbaf82a227dcebd2f9334496658801f63299ba24', gasLimit:1500000})",
         "EtherPost.methods.clap('0xad9766f01697840a5b1dd2c9123bc9c5bd0b69f5fccd78cd2ca55a59e46193b8').send({from: '0xf09324e7a1e2821c2f7a4a47675f9cf0b1a5eb7f', gasLimit:1500000})",
         "EtherPost.methods.clap('0xad9766f01697840a5b1dd2c9123bc9c5bd0b69f5fccd78cd2ca55a59e46193b8').send({from: '0xf09324e7a1e2821c2f7a4a47675f9cf0b1a5eb7f', gasLimit:1500000})",
         "EtherPost.methods.clap('0xad9766f01697840a5b1dd2c9123bc9c5bd0b69f5fccd78cd2ca55a59e46193b8').send({from: '0xf09324e7a1e2821c2f7a4a47675f9cf0b1a5eb7f', gasLimit:1500000})",
         "EtherPost.methods.clap('0xf0d980a7c254f81bc1eaadedf0cb24aa5474b6319b1eb0327caa98257c55bce9').send({from: '0xfbaf82a227dcebd2f9334496658801f63299ba24', gasLimit:1500000})",
         "EtherPost.methods.clap('0x7c39737b03f7e04f8211e0a930602fc3bb415cd2824929dfad17823d7bdabd0d').send({from: '0xf09324e7a1e2821c2f7a4a47675f9cf0b1a5eb7f', gasLimit:1500000})",
        ]
      }
    }
    
  },


  // merges with the settings in default
  // used with "embark run privatenet"
  privatenet: {
  },

  // merges with the settings in default
  // used with "embark run testnet"
  testnet: {
  },

  // merges with the settings in default
  // used with "embark run livenet"
  livenet: {
  },

  // you can name an environment with specific settings and then specify with
  // "embark run custom_name" or "embark blockchain custom_name"
  //custom_name: {
  //}
};
