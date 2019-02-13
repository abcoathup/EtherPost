pragma solidity 0.4.24;

contract EtherPostInterface {

  function upload(bytes32 ipfsHash) public;
  function getUploads(address uploader) public returns(bytes32[] memory);

}