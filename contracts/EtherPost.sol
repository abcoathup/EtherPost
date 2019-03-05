pragma solidity 0.4.24;

import "./EtherPostInterface.sol";

contract EtherPost is EtherPostInterface {
  mapping(address => bytes32[]) private uploads;
  mapping(bytes32 => bytes32[]) private comments;
  mapping(bytes32 => uint) private claps;

  function upload(bytes32 ipfsHash) public {
    uploads[msg.sender].push(ipfsHash);

    emit LogUpload(msg.sender, ipfsHash);
  }

  function getUploads(address uploader) public returns(bytes32[] memory) {
    return uploads[uploader];
  }

  function clap(bytes32 ipfsHash) public {
    claps[ipfsHash]++;

    emit LogClap(msg.sender, ipfsHash);
  }

  function getClapCount(bytes32 ipfsHash) public returns(uint) {
    return claps[ipfsHash];
  }

  function comment(bytes32 imageHash, bytes32 commentHash) public {
    uint timestamp = block.timestamp;
    comments[imageHash].push(commentHash);

    emit LogComment(msg.sender, imageHash, commentHash, timestamp);
  }

  function getComments(bytes32 ipfsHash) public returns(bytes32[] memory) {
    return comments[ipfsHash];
  }
}



