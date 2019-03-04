const Identity = require('Embark/contracts/Identity');

let accounts;
let username = "username";

// For documentation please see https://embark.status.im/docs/contracts_testing.html
config({
  //deployment: {
  //  accounts: [
  //    // you can configure custom accounts with a custom balance
  //    // see https://embark.status.im/docs/contracts_testing.html#Configuring-accounts
  //  ]
  //},
  contracts: {
    "Identity": {
      args: []
    }
  }
}, (_err, web3_accounts) => {
  accounts = web3_accounts
});

contract("Identity", function () {
  this.timeout(0);

  it('No username', async () => {
    let _username = await Identity.methods.names(accounts[0]).call()
    assert.equal(_username, "");
  });

  it('Register a username', async () => {
    await Identity.methods.register(username).send()
    let _username = await Identity.methods.names(accounts[0]).call()
    assert.equal(username, _username);
  });

  //Register a username
  //Lookup a username for an address
  //Unregister (optional, but you might want to think about it)
  //Don’t allow others to hijack your name
  //Only allow the actual owner of an address to register

});

