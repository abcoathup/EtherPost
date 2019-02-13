const EtherPost = require('Embark/contracts/EtherPost');
const bs58 = require('bs58');

let accounts;

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

  it('Address has zero uploads', async () => {
    let uploads = await EtherPost.methods.getUploads(accounts[0]).call()
    // console.log('upload as bytes', uploads[0])
    // console.log('upload', getIpfsHashFromBytes32(uploads[0]))
  
    assert.equal(uploads.length, 0);
  });

  it('Lets us store a hash', async () => {
    let testHash = 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ4St'
    // ATT: We slice off the first two bytes because they represent the hashing algorithm,
    // which we assume to be static here and now so we can store the hash in a bytes32.
    await EtherPost.methods.upload(getBytes32FromIpfsHash(testHash)).send();
    let uploads = await EtherPost.methods.getUploads(accounts[0]).call()
    // console.log('upload as bytes', uploads[0])
    // console.log('upload', getIpfsHashFromBytes32(uploads[0]))
  
    assert.equal(uploads.length, 1)
    assert.equal(getIpfsHashFromBytes32(uploads[0]), testHash)
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