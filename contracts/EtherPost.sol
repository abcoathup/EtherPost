pragma solidity 0.4.24;

import "./EtherPostInterface.sol";

contract EtherPost is EtherPostInterface {
  mapping(address => bytes32[]) public posts;

  function upload(bytes32 ipfsHash) public {
    posts[msg.sender].push(ipfsHash);
  }

  function getUploads(address uploader) public returns(bytes32[]) {
    return posts[uploader];
  }
}