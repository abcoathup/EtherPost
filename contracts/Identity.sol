pragma solidity 0.4.24;

contract Identity {
  mapping (address => string) private names;

  function register(string memory name) public {
    require(bytes(names[msg.sender]).length == 0, "Address already registered name");
    names[msg.sender] = name;
  }

  function getName(address user) public view returns(string memory) {
    return names[user];
  }
}