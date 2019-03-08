pragma solidity 0.4.24;

/**
 * @title EtherPostInterface
 * @author RMIT Online (Flex Dapps)
 * @dev EtherPostInterface for storing image uploads, comments and claps.
 * IPFS hashes are encoded to bytes32 with Qm removed.
 */
contract EtherPostInterface {

  event LogUpload(address uploader, bytes32 ipfsHash);
  event LogClap(address clapper, bytes32 ipfsHash);
  event LogComment(address commenter, bytes32 imageHash, bytes32 commentHash, uint timestamp);

  function upload(bytes32 ipfsHash) public;
  function getUploads(address uploader) public returns(bytes32[] memory);
  function clap(bytes32 ipfsHash) public;
  function getClapCount(bytes32 ipfsHash) public returns(uint);
  function comment(bytes32 imageHash, bytes32 commentHash) public;
  function getComments(bytes32 ipfsHash) public returns(bytes32[] memory);
}