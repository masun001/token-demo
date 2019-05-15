pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/StandardToken.sol";


/**
  @title airdrop demo
  @author mark.ma
*/



contract MorningTechToken is StandardToken{
    string public name = "MorningTech Token";
    string public symbol = "MT";
    uint8 public decimals = 18;
    uint public INITIAL_SUPPLY = 1000000000000000000000;

    /**
      * Constrctor function
      *
      * Setup the owner
      */
    constructor(uint supply, uint8 decimal) public {
        totalSupply = supply;
        balances[msg.sender] = supply;
        decimals = decimal;
    }

}


contract MorningTechAirDrop{
    using SafeMath for uint256;

    uint8 private tokenDecimal;

    bool public haveTransferEth = false;
    bool public parse = false;
    bool public stop = false;
    MorningTechToken private tokenReward;
    mapping(address => uint256) private balanceOf;

    event FundTransfer(address recipient, uint totalAmountRaised);

    /**
     * Constrctor function
     * Setup the owner
     */
    constructor(
    ) public {
        tokenReward = new MorningTechToken(1000000000000000000000, 18);
    }



    function airdropTokens(address[] _recipient) public returns (bool) {
//        uint airdropped;
        for(uint256 i = 0; i< _recipient.length; i++)
        {
            tokenReward.transfer(_recipient[i], 10 ether);
//            tokenReward.transfer(account, (tokenReward.totalSupply() - (amountRaised * rate * (10 ** uint256(tokenDecimal)))/1 ether));
        }

        return true;

    }


    /**
     * Fallback function
     *
     * The function without name is the default function that is called whenever anyone sends funds to a contract
     */
    function () payable public {
        revert();
    }

}