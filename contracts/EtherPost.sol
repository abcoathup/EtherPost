pragma solidity 0.4.24;

import "./EtherPostInterface.sol";

/**
 * @title EtherPost
 * @author @abcoathup
 * @dev EtherPost is a contract for storing image uploads, comments and claps.
 * IPFS hashes are encoded to bytes32 with Qm removed.
 */
contract EtherPost is EtherPostInterface {

  /** @dev Uploader to array of uploads (IPFS Hashes encoded to bytes32) mapping */
  mapping(address => bytes32[]) private uploads;

  /** @dev All uploads (IPFS Hashes encoded to bytes32) */
  bytes32[] private allUploads;

  /** @dev Upload (IPFS Hash encoded to bytes32) to count of claps mapping */
  mapping(bytes32 => uint) private claps;

  /** @dev Upload (IPFS Hash encoded to bytes32) to array of comments (IPFS Hash) mapping */
  mapping(bytes32 => bytes32[]) private comments;

  /** @dev Upload (IPFS Hash encoded to bytes32) to uploader address mapping */
  mapping(bytes32 => address) private uploaders;

  /** @dev Modifier checks for upload doesn't exist. */
  modifier uploadNotExists(bytes32 ipfsHash) {
    require(uploaders[ipfsHash] == address(0), "Upload exists");
    _;
  }

  /** @dev Modifier checks for upload exists. */
  modifier uploadExists(bytes32 ipfsHash) {
    require(uploaders[ipfsHash] != address(0), "Upload doesn't exist");
    _;
  }

  /**
   * @dev Upload, must not have been uploaded by anyone
   * (implementation of EtherPostInterface)
   * @param ipfsHash upload (IPFS Hash encoded to bytes32)
   */
  function upload(bytes32 ipfsHash) public uploadNotExists(ipfsHash) {
    uploaders[ipfsHash] = msg.sender;
    uploads[msg.sender].push(ipfsHash);
    allUploads.push(ipfsHash);

    emit LogUpload(msg.sender, ipfsHash);
  }

  /**
   * @dev Clap an Upload, upload must exist
   * (implementation of EtherPostInterface)
   * @param ipfsHash upload (IPFS Hash encoded to bytes32)
   */
  function clap(bytes32 ipfsHash) public uploadExists(ipfsHash) {
    claps[ipfsHash]++;

    emit LogClap(msg.sender, ipfsHash);
  }

  /**
   * @dev Comment on an Upload, upload must exist
   * (implementation of EtherPostInterface)
   * @param imageHash upload (IPFS Hash encoded to bytes32)
   * @param commentHash comment (IPFS Hash encoded to bytes32)
   */
  function comment(bytes32 imageHash, bytes32 commentHash) public uploadExists(imageHash) {
    uint timestamp = block.timestamp;
    comments[imageHash].push(commentHash);

    emit LogComment(msg.sender, imageHash, commentHash, timestamp);
  }

  /**
   * @dev Get uploads for uploader
   * (implementation of EtherPostInterface)
   * @param uploader address
   * @return array of uploads (IPFS Hashes encoded to bytes32)
   */
  function getUploads(address uploader) public returns(bytes32[] memory) {
    return uploads[uploader];
  }

  /**
   * @dev Get clap count for upload
   * (implementation of EtherPostInterface)
   * @param ipfsHash upload (IPFS Hash encoded to bytes32)
   * @return clap count
   */
  function getClapCount(bytes32 ipfsHash) public uploadExists(ipfsHash) returns(uint) {
    return claps[ipfsHash];
  }

  /**
   * @dev Get comments for upload
   * (implementation of EtherPostInterface)
   * @param ipfsHash upload (IPFS Hash encoded to bytes32)
   * @return array of comments (IPFS Hashes encoded to bytes32)
   */
  function getComments(bytes32 ipfsHash) public uploadExists(ipfsHash) returns(bytes32[] memory) {
    return comments[ipfsHash];
  }

  /**
   * @dev Get uploader for upload
   * @param ipfsHash upload (IPFS Hash encoded to bytes32)
   * @return uploader address
   */
  function getUploader(bytes32 ipfsHash) public view uploadExists(ipfsHash) returns(address) {
    return uploaders[ipfsHash];
  }

  /**
   * @dev Get all uploads
   * @return array of uploads (IPFS Hashes encoded to bytes32)
   */
  function getAllUploads() public view returns(bytes32[] memory) {
    return allUploads;
  }
}