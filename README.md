# token-demo
token-demo
# Token Tutorial

A token tutorial of Crowd funding。

#  使用步骤

1. 安装依赖

```
npm install -g truffle
```

2. truffle compile

3. deploy contract
```
3.1. 'truffle develop' for (local chain) or 'truffle deploy --network live' for (Blochshine Chain)
     # http://localhost:9545/ (local chain RPC) or http://106.15.190.194:8090/ (Blochshine Chain RPC)
     vi migrations/2_deploy_contracts.js
     select an account id from truffle generated for instance: 0x627306090abaB3A6e1400e9345bC60c78a8BEf57
     truffle develop> migrate --reset
3.3. truffle develop --log (open in another terminal.)
     # log console
```

4. npm run dev (open in another terminal.)

5. debugging contract
```
truffle deploy> debug <Trans Id>

# Command Description
1. execute 'truffle develop' in new Terminal for compile、deploy、reset and debug contracts.
2. execute 'truffle develop --log' in new terminal for details logs.
3. execute 'npm run dev' in new terminal for start your local web service.

check more details at below:
http://truffleframework.com/tutorials/debugging-a-smart-contract


#  调用关键RPC APIs.

1.Request:
{"jsonrpc":"2.0","id":4,"method":"eth_accounts","params":[]}
Response:
{"jsonrpc":"2.0","id":4,"result":["0xc23d742b64d52157337b4ae7fe307e480dbbad01","0xf744e45aa3650d11a990944b2a865ed6741391cb","0xb2f39274cafefd5560cf98190003d0acbb4a9aaa"]}

2.Request:
{"jsonrpc":"2.0","id":5,"method":"eth_sendTransaction","params":[{"from":"0xc23d742b64d52157337b4ae7fe307e480dbbad01","to":"0xb13acbedfc533da05ffb3db7c680fcddbd6992be","data":"0xa9059cbb000000000000000000000000cd6e332f8af38a25284723bcdf7a728a062c925a0000000000000000000000000000000000000000000000000000000000000064"}]}
Response:
{"jsonrpc":"2.0","id":5,"result":"0x371841d6d30c0068216ea66d3bd93337d619796673f3cbc73af593da7263f764"}

3.Request:
{"jsonrpc":"2.0","id":7,"method":"eth_getTransactionReceipt","params":["0x371841d6d30c0068216ea66d3bd93337d619796673f3cbc73af593da7263f764"]}
Response:
{"jsonrpc":"2.0","id":7,"result":null}

4.Request
{"jsonrpc":"2.0","id":3,"method":"eth_call","params":[{"to":"0xb13acbedfc533da05ffb3db7c680fcddbd6992be","data":"0x70a08231000000000000000000000000c23d742b64d52157337b4ae7fe307e480dbbad01"},"latest"]}
Response
{"jsonrpc":"2.0","id":3,"result":"0x000000000000000000000000000000000000000000000000000000003b9ac936"}

