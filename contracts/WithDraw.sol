pragma solidity ^0.4.18;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {

    address public owner;
    event OwnershipTransferred (address indexed _from, address indexed _to);

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    function Ownable() public{
        owner = msg.sender;
        OwnershipTransferred(address(0), owner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        owner = newOwner;
        OwnershipTransferred(owner,newOwner);
    }
}

/**
 * @title Token
 * @dev API interface for interacting with the Token contract
 */
interface Token {
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);
    function balanceOf(address _owner) constant external returns (uint256 balance);
}

contract WithDraw is Ownable {

    Token token;
    mapping(address => uint256) public redeemBalanceOf;
    event BalanceSet(address indexed beneficiary, uint256 value);
    event Redeemed(address indexed beneficiary, uint256 value);

    function WithDraw() public {
        address _tokenAddr = MY_TOKEN_ADDR;
        token = Token(_tokenAddr);
    }

    function setBalances(address[] dests, uint256[] values) onlyOwner public {
        uint256 i = 0;
        while (i < dests.length){
            if(dests[i] != address(0))
            {
                uint256 toSend = values[i] * 10**18;
                redeemBalanceOf[dests[i]] += toSend;
                BalanceSet(dests[i],values[i]);
            }
            i++;
        }
    }

    function redeem(uint256 quantity) external{
        uint256 baseUnits = quantity * 10**18;
        uint256 senderEligibility = redeemBalanceOf[msg.sender];
        uint256 tokensAvailable = token.balanceOf(this);
        require(senderEligibility >= baseUnits);
        require( tokensAvailable >= baseUnits);
        if(token.transfer(msg.sender,baseUnits)){
            redeemBalanceOf[msg.sender] -= baseUnits;
            Redeemed(msg.sender,quantity);
        }
    }

    function removeBalances(address[] dests, uint256[] values) onlyOwner public {
        uint256 i = 0;
        while (i < dests.length){
            if(dests[i] != address(0))
            {
                uint256 toRevoke = values[i] * 10**18;
                if(redeemBalanceOf[dests[i]]>=toRevoke)
                {
                    redeemBalanceOf[dests[i]] -= toRevoke;
                    BalanceCleared(dests[i],values[i]);
                }
            }
            i++;
        }

    }