pragma solidity ^0.8.4;

import "forge-std/Test.sol";
import "../contracts/OffchainResolver.sol";
import "forge-std/console.sol";

contract ContractBTest is Test {
    OffchainResolver resolver;

    function setUp() public {
        resolver = new OffchainResolver("url", address(this));
    }

    function test_NumberIs42() public {
        console.log("resolver address", address(resolver));
        resolver.resolve("name", "data");

    }
}