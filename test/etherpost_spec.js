const EtherPost = require('Embark/contracts/EtherPost');
const bs58 = require('bs58');

let accounts;
let etherPostInstance;
const testHash1 = 'QmcniBv7UQ4gGPQQW2BwbD4ZZHzN3o3tPuNLZCbBchd1zh';
const testHash2 = 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ4St';
const testHash3 = 'Qma6e8dovfLyiG2UUfdkSHNPAySzrWLX9qVXb44v1muqcp';
const testHash4 = 'QmbVkMHyKXehsAG6Mq8zj1ULZi3vYQf3YWprh5kwdTRZXc';
const testHash5 = 'QmcDdvUupWv4gPmHYoibEegFtVJTA5gXYpEcDmgeJQHZLB';

// For documentation please see https://embark.status.im/docs/contracts_testing.html
config({
  //deployment: {
  //  accounts: [
  //    // you can configure custom accounts with a custom balance
  //    // see https://embark.status.im/docs/contracts_testing.html#Configuring-accounts
  //  ]
  //},
  contracts: {
    "EtherPost": {
      args: []
    }
  }
}, (_err, web3_accounts) => {
  accounts = web3_accounts
});

contract("EtherPost", function () {
  this.timeout(0);

  beforeEach(async function() {
    etherPostInstance = await EtherPost.deploy().send();
  });

  it('should have zero posts for new address', async () => {
    let uploads = await etherPostInstance.methods.getUploads(accounts[0]).call();
    assert.equal(uploads.length, 0);
  });

  it('should upload a post', async () => {
    const txResult = await etherPostInstance.methods.upload(getBytes32FromIpfsHash(testHash1)).send();
    const event = txResult.events.LogUpload;
    const uploader = event.returnValues.uploader;
    const ipfsHash = event.returnValues.ipfsHash;
    assert.equal(uploader, accounts[0]);
    assert.equal(getIpfsHashFromBytes32(ipfsHash), testHash1);

    let uploads = await etherPostInstance.methods.getUploads(accounts[0]).call();
    assert.equal(uploads.length, 1);
    assert.equal(getIpfsHashFromBytes32(uploads[0]), testHash1);
  });

  it('should upload a post for multiple accounts', async () => {
    // Two uploads for account 0
    await etherPostInstance.methods.upload(getBytes32FromIpfsHash(testHash1)).send({from: accounts[0]});
    await etherPostInstance.methods.upload(getBytes32FromIpfsHash(testHash2)).send({from: accounts[0]});
        
    // Three uploads for account 1
    await etherPostInstance.methods.upload(getBytes32FromIpfsHash(testHash3)).send({from: accounts[1]});
    await etherPostInstance.methods.upload(getBytes32FromIpfsHash(testHash4)).send({from: accounts[1]});
    await etherPostInstance.methods.upload(getBytes32FromIpfsHash(testHash5)).send({from: accounts[1]});
    
    let uploads = await etherPostInstance.methods.getUploads(accounts[0]).call();
    assert.equal(uploads.length, 2);
    assert.equal(getIpfsHashFromBytes32(uploads[0]), testHash1);
    assert.equal(getIpfsHashFromBytes32(uploads[1]), testHash2);

    uploads = await etherPostInstance.methods.getUploads(accounts[1]).call();
    assert.equal(uploads.length, 3);
    assert.equal(getIpfsHashFromBytes32(uploads[0]), testHash3);
    assert.equal(getIpfsHashFromBytes32(uploads[1]), testHash4);
    assert.equal(getIpfsHashFromBytes32(uploads[2]), testHash5);
  });

  it('should upload multiple posts', async () => {
    let posts = 10;
    for (var post = 0; post < posts; post++) {
      await etherPostInstance.methods.upload(getBytes32FromIpfsHash(testHash1)).send();
    }
    let uploads = await etherPostInstance.methods.getUploads(accounts[0]).call()
    assert.equal(uploads.length, posts);

    for (var post = 0; post < posts; post++) {
      assert.equal(getIpfsHashFromBytes32(uploads[post]), testHash1);
    }
  });
});

// Return bytes32 hex string from IPFS hash
function getBytes32FromIpfsHash(ipfsHash) {
  return "0x" + bs58.decode(ipfsHash).slice(2).toString('hex')
}

// Return base58 encoded ipfs hash from bytes32 hex string
function getIpfsHashFromBytes32(bytes32Hex) {
  // Add default ipfs values for first 2 bytes: function: 0x12=sha2, size: 0x20=256 bits
  // Cut off leading "0x"
  const hex = "1220" + bytes32Hex.slice(2)
  const hashBytes = Buffer.from(hex, 'hex');
  const str = bs58.encode(hashBytes)
  return str
}