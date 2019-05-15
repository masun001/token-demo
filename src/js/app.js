App = {
  web3Provider: null,
  contracts: {},
  myaccount: null,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    // alert(web3+"???");
    if (typeof web3 == 'undefined') {
    alert("web3.currentProvider");
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
//    alert("new HttpProvider");
      // set the provider you want from Web3.providers106.15.190.194
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545/');
//        App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/ANkrqQ5EuTW4ZSL4AckY');
      web3 = new Web3(App.web3Provider);
    }

    // alert(web3);

    App.myaccount = $('#SelectEthAcctAddress').val();
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Crowdsale.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var CrowdsaleArtifact = data;
      App.contracts.Crowdsale = TruffleContract(CrowdsaleArtifact);
      // Set the provider for our contract.
      App.contracts.Crowdsale.setProvider(App.web3Provider);

      App.contracts.Crowdsale.deployed().then(function(instance) {
        var crowdsale = instance;
        instance.GoalReached({}, '', function(error, result){
          if (!error){
              console.log("Congratus! Our goal have reached." + result.args.totalAmountRaised * Math.pow(10, -18));
              alert("Congratus! Our goal have reached." + result.args.totalAmountRaised * Math.pow(10, -18));
          }
        });
        instance.FundTransfer({}, '', function(error, result){
          if (!error)
            if (result.args.isContribution) {
                alert("\n New backer! Received " + result.args.amount * Math.pow(10, -18) + " ether from " + result.args.backer  )
                console.log( "\n The current funding at " +( 100 *  crowdsale.camountRaised.call() / crowdsale.cfundingGoal.call()) + "% of its goals.");

                App.syncAllInfo();
                App.getTokenBalances();
            } else {
                console.log("Funds transferred from crowdsale account: " + result.args.amount * Math.pow(10, -18) + " ether to " + result.args.backer  )
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
    $(document).on('click', '#addAddressButton', App.addAddress);
  },

  addAddress: function(){
//  alert(web3.eth.accounts);

  var address = web3.personal.newAccount($('#password').val());
    alert("address:" + address);
  $('#addressResult').text(address);
//    web3.eth.personal.newAccount($('#password').val(), function(){
//
//    });

//

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
    App.contracts.Crowdsale.deployed().then(function(instance) {
      return instance.totalSupply();
    }).then(function(result) {
      $('#publishedToken').text(result.toNumber());
    }).catch(function(err) {
      console.log("totalSupply " + err.message);
    });
    App.contracts.Crowdsale.deployed().then(function(instance) {
      $('#contractAddress').text(instance.address);
      $('#EthTransferAddress').val(instance.address);
      return instance.cfundingGoal();
    }).then(function(result) {
      $('#fundingGoal').text(web3.fromWei(result.toNumber(), 'ether'));
    }).catch(function(err) {
      console.log("fundingGoal " + err.message);
    });
    App.contracts.Crowdsale.deployed().then(function(instance) {
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
    App.contracts.Crowdsale.deployed().then(function(instance) {
      return instance.cdeadline();
    }).then(function(result) {

      var timeleft = Math.floor(Date.now() / 1000) - parseInt(result);
      if (timeleft>3600) {  $('#deadLine').text("Deadline has passed, " + Math.floor(timeleft/60) + " minutes ago")
      } else if (timeleft>0) {  $('#deadLine').text("Deadline has passed, " + Math.floor(timeleft/60) + " minutes ago")
      } else if (timeleft>-3600) {  $('#deadLine').text(Math.floor(-1 * timeleft/60) + " minutes until deadline")
      } else {  $('#deadLine').text(Math.floor(-1*timeleft/60) + " minutes until deadline")
      }
    });
  },

  handleTransfer: function(event) {
    event.preventDefault();

    var amount = parseFloat($('#EthTransferAmount').val());
    var pwd = $('#EthAccountPassword').val();
    console.log('Transfers ' + amount + ' ether from ' + App.myaccount);

    App.contracts.Crowdsale.deployed().then(function(instance) {
      return web3.personal.unlockAccount(App.myaccount, pwd);
    }).then(function(result) {
      console.log('Account unlocked ' + result);

      App.contracts.Crowdsale.deployed().then(function(instance) {
         return instance.ccrowdsaleClosed.call();
      }).then(function(result) {
         console.log('crowdsaleClosed: ' + result);

         if (!result) {
           App.contracts.Crowdsale.deployed().then(function(instance) {
//           truffle 框架 预估gas 不报错，换成Java 底层链调用报错  所以将金额置为1，后续需要优化.
              return web3.eth.estimateGas({from: App.myaccount, to: instance.address, value: web3.toWei(amount, 'ether')});
           }).then(function(result) {
              console.log('evaluated gas: ' + result);
             // alert("evaluated gas: " + result);
             var dams = parseInt(result)*amount;

              App.contracts.Crowdsale.deployed().then(function(instance) {
                 return instance.sendTransaction({from: App.myaccount, to: instance.address, value: web3.toWei(amount, 'ether'), gas: 2000000});
              }).then(function(result) {
                 console.log('Transfer Result: ' + result.tx);
              }).catch(function(err) {
                 alert("Transfer error!: " + err.message);
              });

           }).catch(function(err) {
              alert("estimateGas error!: " + err.message);
           });
         } else {

            App.contracts.Crowdsale.deployed().then(function(instance) {
//            from account must be beneficiary due to need to cost gas.
             return web3.eth.estimateGas({from: '0x627306090abab3a6e1400e9345bc60c78a8bef57', to: instance.address, value: web3.toWei(0, 'ether')});

           }).then(function(result) {


                App.contracts.Crowdsale.deployed().then(function(instance) {
//                from account must be beneficiary due to need to cost gas.
//                alert("instance.beneficiary:" + instance.address);
                     return instance.sendTransaction({from: '0x627306090abab3a6e1400e9345bc60c78a8bef57', to: instance.address, value: web3.toWei(0, 'ether'), gas: parseInt(result) + 100});
                  }).then(function(result) {
                     console.log('Transfer to beneficiary Result: ' + result.tx);
                  }).catch(function(err) {
                     alert("Transfer to beneficiary error!: " + err.message);
                  });

           }).catch(function(err) {
              alert("crowdsaleClosed: " + err.message);
           });
            alert("crowdsaleClosed, thank you for attention");
         }
       }).catch(function(err) {
          alert("crowdsaleClosed: " + err.message);
       });

   }).catch(function(err) {
      alert("unlockAccount " + err.message + ", account: " + App.myaccount);
   });
  },

  handleTokenTransfer: function(event) {
  },

  getTokenBalances: function(adopters, account) {
    console.log('Getting '+App.myaccount+' token balances...');
    App.contracts.Crowdsale.deployed().then(function(instance) {
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
    App.contracts.Crowdsale.deployed().then(function(instance) {
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
