'use strict';

// call the packages we need
const Fabric_Client = require('fabric-client');
const CONSTANT = require('../common/constant');


// init Object : 분산원장에 접근 할 인증된 유저 객체를 초기화
module.exports.initObject = (fabric_client) =>
{
    const store_path = CONSTANT.FABRIC_WALLET_PATH;
    console.log('Store path:'+store_path);

    return Fabric_Client.newDefaultKeyValueStore({ path: store_path
    })
        .then((state_store) => {

            // assign the store to the fabric client
            fabric_client.setStateStore(state_store);
            var crypto_suite = Fabric_Client.newCryptoSuite();
            // use the same location for the state store (where the users' certificate are kept)
            // and the crypto store (where the users' keys are kept)
            var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
            crypto_suite.setCryptoKeyStore(crypto_store);
            fabric_client.setCryptoSuite(crypto_suite);

            // get the enrolled user from persistence, this user will sign all requests
            // return fabric_client.getUserContext(CONSTANT.FABRIC_USER_NAME, true);
            return fabric_client.getUserContext(CONSTANT.FABRIC_USER_NAME, true);
        })
        .then((user_from_store) => {
            if (user_from_store && user_from_store.isEnrolled()) {
                console.log('Successfully loaded user1 from persistence');
                // let member_user = null;
                // member_user = user_from_store;
            } else {
                throw new Error('Failed to get user1.... run registerUser.js');
            }

            // setup the fabric network
            let channel = fabric_client.newChannel(CONSTANT.FABRIC_CHANEL_NAME);
            let peer = fabric_client.newPeer(CONSTANT.FABRIC_PEER_URL);
            let targets = []; // 보증인

            channel.addPeer(peer);
            targets.push(peer);

            let initObject = {
                "channel" : channel,
                "targets" : targets,
                "client" : fabric_client
            };

            return initObject;
        })
};

//  조회용 체인코들 호출
module.exports.queryByChainCode= (ClientObj, chainCodeName, args) =>
{

    // 트랜잭션 ID 생성, 호출할 체인코드의 트랜잭션 이름과 인수와 함께 request 생성
    let tx_id = ClientObj['client'].newTransactionID();
    let channel = ClientObj['channel'];

    const request = {
        chaincodeId: 'tuna-app',
        txId: tx_id,
        fcn: chainCodeName,
        args: args,
        targets: ClientObj['targets']
    };

    // send the query proposal to the peer
    return channel.queryByChaincode(request);
};