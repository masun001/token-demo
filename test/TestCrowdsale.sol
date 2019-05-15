pragma solidity ^0.4.18;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Crowdsale.sol";

contract TestCrowdsale {

  function testInitialSetupInDeployedContract() public {
     Crowdsale meta = Crowdsale(DeployedAddresses.Crowdsale());

     uint fundingGoal = 100000000000000000000;
     Assert.equal(meta.cfundingGoal(), fundingGoal, "Owner should have 100 token published!");
     Assert.equal(meta.ccrowdsaleClosed(), false, "Crowdsale must not be closed at beginning!");
  }

  function testSendingTransaction() public {
     Crowdsale meta = Crowdsale(DeployedAddresses.Crowdsale());
     meta.transfer(10);
     Assert.equal(meta.camountRaised(), 10, "10 ethers have been transferred!");
  }

}
