App = {
  web3Provider: null,
  contracts: {},
  myaccount: null,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers106.15.190.194
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545/');
      web3 = new Web3(App.web3Provider);
    }

    App.myaccount = $('#SelectEthAcctAddress').val();
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Crowdsale2.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var Crowdsale2Artifact = data;
      App.contracts.Crowdsale2 = TruffleContract(Crowdsale2Artifact);
      // Set the provider for our contract.
      App.contracts.Crowdsale2.setProvider(App.web3Provider);

      App.contracts.Crowdsale2.deployed().then(function(instance) {
        var Crowdsale2 = instance;
        instance.GoalReached({}, '', function(error, result){
          if (!error){
              console.log("Congratus! Our goal have reached." + result.args.totalAmountRaised);
              alert("Congratus! Our goal have reached." + result.args.totalAmountRaised);
          }
        });
        instance.FundTransfer({}, '', function(error, result){
          if (!error)
            if (result.args.isContribution) {
                alert("\n New backer! Received " + result.args.amount + " ether from " + result.args.backer  )
                console.log( "\n The current funding at " +( 100 *  Crowdsale2.camountRaised.call() / Crowdsale2.cfundingGoal.call()) + "% of its goals.");

                App.syncAllInfo();
                App.getTokenBalances();
            } else {
                console.log("Funds transferred from Crowdsale2 account: " + result.args.amount + " ether to " + result.args.backer  )
            }
        });
      });

      App.syncAllInfo();
      // Use our contract to retieve and mark the adopted pets.
      App.getTokenBalances();
      App.bindEvents();
      return true;
    });
    return true;
  },

  bindEvents: function() {
    $(document).on('keyup', '#SelectEthAcctAddress', App.selectEthAcctAddress);
    $(document).on('click', '#transferEthButton', App.handleTransfer);
    $(document).on('click', '#queryEthButton', App.getOtherBalance);

    $(document).on('click', '#transferTokenButton', App.handleTokenTransfer);
    $(document).on('click', '#queryTokenButton', App.getOtherTBalance);
  },

  selectEthAcctAddress: function() {
    App.myaccount = $('#SelectEthAcctAddress').val();
    $('#TTAccount').text(App.myaccount);
    App.getTokenBalances();
    App.syncAllInfo();
  },

  syncAllInfo: function() {
    web3.eth.getBalance(App.myaccount, function(error, d) {
      if (error) {
        console.log(error);
        return;
      }
      $('#EthBalance').text(web3.fromWei(d, 'ether'));
    });
    App.contracts.Crowdsale2.deployed().then(function(instance) {
      return instance.totalSupply();
    }).then(function(result) {
      $('#publishedToken').text(result.toNumber());
    }).catch(function(err) {
      console.log("totalSupply " + err.message);
    });
    App.contracts.Crowdsale2.deployed().then(function(instance) {
      $('#contractAddress').text(instance.address);
      $('#EthTransferAddress').val(instance.address);
      return instance.cfundingGoal();
    }).then(function(result) {
      $('#fundingGoal').text(web3.fromWei(result.toNumber(), 'ether'));
    }).catch(function(err) {
      console.log("fundingGoal " + err.message);
    });
    App.contracts.Crowdsale2.deployed().then(function(instance) {
      return instance.camountRaised();
    }).then(function(result) {
      $('#fundedGoal').text(web3.fromWei(result.toNumber(), 'ether'));
      if ($('#fundingGoal').val() == $('#fundedGoal').val()) {
          $('#fundedGoal').text(web3.fromWei(result.toNumber(), 'ether')).css('color','red');
          //alert('goal has reached!');
      }
    }).catch(function(err) {
      console.log("amountRaised " + err.message);
    });
    App.contracts.Crowdsale2.deployed().then(function(instance) {
      return instance.cdeadline();
    }).then(function(result) {
      var timeleft = Math.floor(Date.now() / 1000) - parseInt(result);
      if (timeleft>3600) {  $('#deadLine').text("Deadline has passed, " + Math.floor(timeleft/3600) + " hours ago")
      } else if (timeleft>0) {  $('#deadLine').text("Deadline has passed, " + Math.floor(timeleft/60) + " minutes ago")
      } else if (timeleft>-3600) {  $('#deadLine').text(Math.floor(-1*timeleft/60) + " minutes until deadline")
      } else {  $('#deadLine').text(Math.floor(-1*timeleft/3600) + " hours until deadline")
      }
    });
  },

  handleTransfer: function(event) {
    event.preventDefault();

    var amount = parseInt($('#EthTransferAmount').val());
    var pwd = $('#EthAccountPassword').val();
    console.log('Transfers ' + amount + ' ether from ' + App.myaccount);

   // App.contracts.Crowdsale2.deployed().then(function(instance) {
   //   return web3.personal.unlockAccount(App.myaccount, pwd);
   // }).then(function(result) {
   //   console.log('Account unlocked ' + result);
      App.contracts.Crowdsale2.deployed().then(function(instance) {
         return instance.cCrowdsale2Closed.call();
      }).then(function(result) {
         console.log('Crowdsale2Closed: ' + result);
         if (!result) {
           App.contracts.Crowdsale2.deployed().then(function(instance) {
              return web3.eth.estimateGas({from: App.myaccount, to: instance.address, value: web3.toWei(amount, 'ether')});
           }).then(function(result) {
              console.log('evaluated gas: ' + result);

              App.contracts.Crowdsale2.deployed().then(function(instance) {
                 return instance.sendTransaction({from: App.myaccount, to: instance.address, value: web3.toWei(amount, 'ether'), gas: result});
              }).then(function(result) {
                 console.log('Transfer Result: ' + result.tx);
              }).catch(function(err) {
                 alert("Transfer error!: " + err.message);
              });

           }).catch(function(err) {
              alert("estimateGas error!: " + err.message);
           });
         } else {
           alert("Goal has reached!");
         }
      // }).catch(function(err) {
      //    alert("Crowdsale2Closed: " + err.message);
      // });

   }).catch(function(err) {
      alert("unlockAccount " + err.message + ", account: " + App.myaccount);
   });
  },

  handleTokenTransfer: function(event) {
    event.preventDefault();

    var amount = parseFloat($('#TTTransferAmount').val());
    var toAddress = $('#TTTransferAddress').val();

    console.log('Transfer token ' + amount + ' TT to ' + toAddress);

    //Crowdsale2.deployed().then(function(instance) { return instance.ttransfer('0xf17f52151ebef6c7334fad080c5704d77216b732', 1); }).then(function(value){return value; });
    App.contracts.Crowdsale2.deployed().then(function(instance) {
      return instance.ttransfer(toAddress, amount);
    }).then(function(result) {
      alert('Transfer Successful!');
      App.syncAllInfo();
      return App.getTokenBalances();
    }).catch(function(err) {
      alert("ttransfer: " + err.message);
    });

  },

  getTokenBalances: function(adopters, account) {
    console.log('Getting '+App.myaccount+' token balances...');
    App.contracts.Crowdsale2.deployed().then(function(instance) {
      return instance.tbalanceOf(App.myaccount);
    }).then(function(result) {
      balance = result.c[0];

      $('#TTBalance').text(balance);
    }).catch(function(err) {
      console.log("tbalanceOf " + err.message);
    });
  },

  getOtherBalance: function() {
    var account = $('#EthQueryAddress').val();
    console.log('Getting '+account+' balances...');
    web3.eth.getBalance(account, function(error, d) {
      if (error) {
        console.log(error);
        return;
      }
      $('#queryResult').text("Result: "+web3.fromWei(d.toNumber(), 'ether'));
    });

  },

  getOtherTBalance: function() {
    var account = $('#TTQueryAddress').val();
    console.log('Getting '+account+' token balances...');
    App.contracts.Crowdsale2.deployed().then(function(instance) {
      return instance.tbalanceOf(account);
    }).then(function(result) {
      balance = result.c[0];

      $('#queryTokenResult').text("Result: "+balance);
    }).catch(function(err) {
      console.log(err.message);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
