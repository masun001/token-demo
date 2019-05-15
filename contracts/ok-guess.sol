pragma solidity ^0.4.24;
//
//contract NBAnet{
//    uint8 constant  WEST_CHAMPION =  0;
//    uint8 constant  EAST_CHAMPION = 1;
//    uint8 constant  FINAL_CHAMPION = 2;
//    uint8 constant TEAMBETS   = 4;
//
//    //用户竞猜了哪场比赛哪支队伍多少BTS
//     mapping(address => uint256)[TEAMBETS+1][3]  public userBetsForTeam;
//     //三场比赛竞猜总额，方便后面计算收益。
//     uint[3]  public amountForBets;
//     //三场比赛按队伍记录竞猜总额，同样也是方便后续计算。
//     uint256[TEAMBETS+1][3]   public teamAmountForBets;
//
//     string[TEAMBETS+1]  teamIdToName;
//     mapping(string => uint8) finalTeamIds;
//
//     function betFinalChampionOfNBAPlayOff(string  teamAbbr) payable public;
//
//     function  betEastChampionOfNBAPlayOff(string  teamAbbr) payable public;
//
//     function betWestChampionOfNBAPlayOff(string teamAbbr) payable public;
//
//     function betChampion(address sender, uint value, uint tId, uint8  catId) internal{
//     	    if(lastBetTimeStamp[sender] >0 && lastBetTimeStamp[sender] < resetTimeStamp)
//     	    {
//     	        //reset
//     	        for(uint8 i=1;i<=TEAMBETS;i++)
//     	        {
//     	            userBetsForTeam[EAST_CHAMPION][i][sender] = 0;
//     	            userBetsForTeam[WEST_CHAMPION][i][sender] = 0;
//     	            userBetsForTeam[FINAL_CHAMPION][i][sender] = 0;
//     	        }
//     	    }
//     	    lastBetTimeStamp[sender] = now;
//     		userBetsForTeam[catId][tId][sender] += value;
//     		amountForBets[catId] += value;
//     		teamAmountForBets[catId][tId] += value;
//
//     		NewBet(catId, tId, value);
//
//     		uint reward = value;
//     		if(address(tokenReward) != 0x0)
//     		{
//         		tokenReward.transfer(sender, reward);
//         		RewardSent(reward);
//     		}
//
//     	}
//
//     	function calculateBonus(uint8 catId, address sender) internal returns(uint catBonus)
//            {
//                catBonus =0;
//                if(championTeamId[catId] > 0)
//                {
//                    if(teamAmountForBets[catId][championTeamId[catId]] > 0)
//        		    {
//                        userWinBetAmount[catId] = userBetsForTeam[catId][championTeamId[catId]][sender];
//                        if(userWinBetAmount[catId] > 0)
//                        {
//                            catBonus = (userWinBetAmount[catId]*amountForBets[catId])/teamAmountForBets[catId][championTeamId[catId]];
//                            userBetsForTeam[catId][championTeamId[catId]][sender] = 0;
//                        }
//        		    }
//                }
//            }
//
//            function claimBetWin() public returns (uint amountToSend)
//            {
//                require(championTeamId[WEST_CHAMPION] >0 || championTeamId[EAST_CHAMPION] > 0 || championTeamId[FINAL_CHAMPION] >0);
//
//                uint totalBonus =0;
//
//                totalBonus += calculateBonus(WEST_CHAMPION, msg.sender);
//                totalBonus += calculateBonus(EAST_CHAMPION, msg.sender);
//                totalBonus += calculateBonus(FINAL_CHAMPION, msg.sender);
//
//
//                if(totalBonus > 0)
//                {
//                    uint tokenToAward;
//
//                    (amountToSend,tokenToAward) = donateAndAwardToken(msg.sender, totalBonus);
//                    if(!msg.sender.send(amountToSend))
//                    {
//                        BonusNotSent(msg.sender, amountToSend);
//                        for(uint8 cat_i=0;cat_i<3;cat_i++)
//                        {
//                            //restore users amount
//                            if(userWinBetAmount[cat_i] > 0)
//                            {
//                            userBetsForTeam[cat_i][championTeamId[cat_i]][msg.sender] = userWinBetAmount[cat_i];
//                            }
//                        }
//                    }
//                    else
//                    {
//                        if(tokenToAward > 0 && address(tokenReward) != 0x0)
//                        {
//                            tokenReward.transfer(msg.sender, tokenToAward);
//                            RewardSent(tokenToAward);
//                        }
//
//                      BonusSent(msg.sender, amountToSend);
//                    }
//                }
//            }
//
//
//
//}