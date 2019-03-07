pragma solidity 0.4.24;

import "./EtherPostInterface.sol";

/**
 * @title EtherPost
 * @dev EtherPost is a contract for storing image uploads, comments and claps.
 */
contract EtherPost is EtherPostInterface {
  mapping(address => bytes32[]) private uploadsByAddress;
  mapping(bytes32 => uint) private claps;
  mapping(bytes32 => bytes32[]) private comments;
  mapping(bytes32 => bool) private uploads;

  /**
   * @dev Modifier to make a function callable only when upload doesn't exist.
   */
  modifier uploadNotExists(bytes32 ipfsHash) {
    require(uploads[ipfsHash] == false, "Upload exists");
    _;
  }

  /**
   * @dev Modifier to make a function callable only when upload exists.
   */
  modifier uploadExists(bytes32 ipfsHash) {
    require(uploads[ipfsHash] == true, "Upload doesn't exist");
    _;
  }

  function upload(bytes32 ipfsHash) public uploadNotExists(ipfsHash) {
    uploads[ipfsHash] = true;
    uploadsByAddress[msg.sender].push(ipfsHash);
 
    emit LogUpload(msg.sender, ipfsHash);
  }

  function clap(bytes32 ipfsHash) public uploadExists(ipfsHash) {
    claps[ipfsHash]++;

    emit LogClap(msg.sender, ipfsHash);
  }

  function comment(bytes32 imageHash, bytes32 commentHash) public uploadExists(imageHash) {
    uint timestamp = block.timestamp;
    comments[imageHash].push(commentHash);

    emit LogComment(msg.sender, imageHash, commentHash, timestamp);
  }

  function getUploads(address uploader) public returns(bytes32[] memory) {
    return uploadsByAddress[uploader];
  }

  function getClapCount(bytes32 ipfsHash) public uploadExists(ipfsHash) returns(uint) {
    return claps[ipfsHash];
  }

  function getComments(bytes32 ipfsHash) public uploadExists(ipfsHash) returns(bytes32[] memory) {
    return comments[ipfsHash];
  }
}



