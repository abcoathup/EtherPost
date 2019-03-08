pragma solidity 0.4.24;

import "./EtherPostInterface.sol";

/**
 * @title EtherPost
 * @dev EtherPost is a contract for storing image uploads, comments and claps.
 */
contract EtherPost is EtherPostInterface {

  /**
   * @dev Uploader to array of uploads (IPFS Hashes) mapping
   */
  mapping(address => bytes32[]) private uploads;

  /**
   * @dev Upload (IPFS Hash) to count of claps mapping
   */
  mapping(bytes32 => uint) private claps;

  /**
   * @dev Upload (IPFS Hash) to array of comments (IPFS Hash) mapping
   */
  mapping(bytes32 => bytes32[]) private comments;
  
  /**
   * @dev Upload (IPFS Hash) to uploader address mapping
   */
  mapping(bytes32 => address) private uploader;

  /**
   * @dev Modifier checks for upload doesn't exist.
   */
  modifier uploadNotExists(bytes32 ipfsHash) {
    require(uploader[ipfsHash] == address(0), "Upload exists");
    _;
  }

  /**
   * @dev Modifier checks for upload exists.
   */
  modifier uploadExists(bytes32 ipfsHash) {
    require(uploader[ipfsHash] != address(0), "Upload doesn't exist");
    _;
  }

  function upload(bytes32 ipfsHash) public uploadNotExists(ipfsHash) {
    uploader[ipfsHash] = msg.sender;
    uploads[msg.sender].push(ipfsHash);
 
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
    return uploads[uploader];
  }

  function getUploader(bytes32 ipfsHash) public returns(address memory) {
    return uploader[ipfsHash];
  }

  function getClapCount(bytes32 ipfsHash) public uploadExists(ipfsHash) returns(uint) {
    return claps[ipfsHash];
  }

  function getComments(bytes32 ipfsHash) public uploadExists(ipfsHash) returns(bytes32[] memory) {
    return comments[ipfsHash];
  }
}



