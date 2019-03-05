pragma solidity 0.4.24;

contract EtherPostInterface {

  event LogUpload(address uploader, bytes32 ipfsHash);

  function upload(bytes32 ipfsHash) public;
  function getUploads(address uploader) public returns(bytes32[] memory);

}