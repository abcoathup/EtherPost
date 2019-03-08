const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

const Identity = require('Embark/contracts/Identity');

let identityInstance;
let accounts;
let name = "name";
let name2 = "name2";

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

  beforeEach(async function() {
    identityInstance = await Identity.deploy().send();
  });

  it('should register a name', async () => {
    await identityInstance.methods.register(name).send();
    let _name = await identityInstance.methods.getName(accounts[0]).call();
    assert.equal(name, _name);
  });

  it('should register names for multiple accounts', async () => {
    await identityInstance.methods.register(name).send();
    let _name = await identityInstance.methods.getName(accounts[0]).call();
    assert.equal(name, _name);

    await identityInstance.methods.register(name2).send({from: accounts[1]});
    let _name2 = await identityInstance.methods.getName(accounts[1]).call();
    assert.equal(name2, _name2);
  });

  it('should fail to register a name if address already registered', async () => {
    await identityInstance.methods.register(name).send({from: accounts[0]});
    await shouldFail.reverting(identityInstance.methods.register(name2).send({from: accounts[0]}));
  });
});