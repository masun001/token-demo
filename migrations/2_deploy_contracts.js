//var testToken = artifacts.require("./OurToken.sol");
var crowdFund = artifacts.require("./Crowdsale.sol");
//var crowdFund1 = artifacts.require("./Crowdsale1.sol");
//var crowdFund2 = artifacts.require("./Crowdsale2.sol");

//module.exports = function(deployer) {
//  deployer.deploy(testToken, 10000).then(function(){
//    console.log("testToken.address: " + testToken.address);
//    return deployer.deploy(crowdFund, '0x2e051c7252dad1a4a99b2cda83114a47424c0807', 100, 10, 30, 20000000000000, 4).then(function(){
//       console.log("deployed successfully!");
//    });
//    // deployer.deploy(crowdFund1, '0xCC8EA67Bb7a42c227370365C79A59489B4c3c6b5', 100, 1, 1, testToken.address).then(function(){
//    //    console.log("deployed successfully!");
//    // });
//    // return deployer.deploy(crowdFund2, '0xCC8EA67Bb7a42c227370365C79A59489B4c3c6b5', 100, 1, 1, testToken.address).then(function(){
//    //    console.log("deployed successfully!");
//    // });
//  });
//};
//0xCeC40BF48Ed24C3907a57DC6d823D64869101f8D

module.exports = function(deployer){
    return deployer.deploy(crowdFund, '0x75feB4AA582Fb616E03Ab6c7c46E53C5F32368dA', 1000, 300, 30, 200000000000000, 4).then(function(){
        console.log("deployed successfully! ");
    });
}
