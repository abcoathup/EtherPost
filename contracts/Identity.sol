pragma solidity 0.4.24;

contract Identity {
  mapping (address => string) public names;

  function register(string memory name) public {
    names[msg.sender] = name;
  }
}