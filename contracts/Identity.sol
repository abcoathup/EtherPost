pragma solidity 0.4.24;

/**
 * @title Identity
 * @author @abcoathup
 * @dev Identity is a simple name registration contract
 */
contract Identity {

  /** @dev address to name mapping */
  mapping (address => string) private names;

  /**
   * @dev Register name (must not have already registered)
   * @param name to register for calling address
   */
  function register(string memory name) public {
    require(bytes(names[msg.sender]).length == 0, "Address already registered name");
    names[msg.sender] = name;
  }

  /**
   * @dev Get name for address
   * @param user to lookup name
   * @return name
   */
  function getName(address user) public view returns(string memory) {
    return names[user];
  }
}