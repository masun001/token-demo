module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 9545,
      network_id: "*" // Match any network id
    }//,
//    live: {
//      host: "10.10.8.87",
//      port: 8090,
//      network_id: "8121993",
//      gas: 4e6,
//	    gasPrice: 2e10  // if we don't pass the gas, we got exception.
//    },
//    live2: {
//      host: "106.15.228.199",
//      port: 8090,
//     // from: "0xF30Ea25257F13E27ab23Be0095943D7de152d3f6",
//      network_id: "*",
//      gas: 0x3d0900,
//      gasPrice: 0x4a817c800  // if we don't pass the gas, we got exception.
//    },
//
//    live3: {
//      host: "localhost",
//      port: 8090,
//     // from: "0xF30Ea25257F13E27ab23Be0095943D7de152d3f6",
//      network_id: "*"
//     // gas: 4e6,
//    // gasPrice: 2e10  // if we don't pass the gas, we got exception.
//    },
//
//    ropsten: {
//        provider: function() {
//            var HDWalletProvider = require("truffle-hdwallet-provider");
//            return new HDWalletProvider("stamp grunt unfold wage acoustic devote gas snake sad rice cross decade",
//                                        "https://ropsten.infura.io/ANkrqQ5EuTW4ZSL4AckY")
//        },
//        network_id: "*",
//        gas: 3012388,
//        gasPrice: 30000000000
//    },
//
//    rpc: {
//	    host: "localhost",
//	    port: 8545
//    }
  }
};