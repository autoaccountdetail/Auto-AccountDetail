'use strict';

// call the packages we need
const Fabric_Client = require('fabric-client');
const CONSTANT = require('../common/constant');
const util = require('util');


// init Object : 분산원장에 접근 할 인증된 유저 객체를 초기화
// mutable function
module.exports.initObject = (user_client) => {
    let fabric_client = user_client.client;
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
            let eventHubs = []; // 이벤트 허브

            channel.addPeer(peer);
            targets.push(peer);
            eventHubs.push(channel.newChannelEventHub(peer));

            user_client.channel = channel;
            user_client.tx_id = fabric_client.newTransactionID();
            user_client.event_hubs = eventHubs;
            user_client.targets = targets;

            return user_client;
        })
};

//  조회용 체인코들 호출
module.exports.queryByChainCode= (ClientObj, chainCodeName, args) => {

    // 트랜잭션 ID 생성, 호출할 체인코드의 트랜잭션 이름과 인수와 함께 request 생성
    let tx_id = ClientObj.client.newTransactionID();
    let channel = ClientObj.channel;

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

// invoke
module.exports.invokeByChainCode = (user_client, chainCodeName, args) => {
    let order = user_client.client.newOrderer(CONSTANT.FABRIC_ODERER_URL);
    user_client.channel.addOrderer(order);
    console.log("Assigning transaction_id: ", user_client.tx_id.getTransactionID());

    const request = {
        //targets : --- letting this default to the peers assigned to the channel
        chaincodeId: CONSTANT.FABRIC_CHAIN_CODE_ID,
        fcn: chainCodeName,
        args: args,
        chainId: CONSTANT.FABRIC_CHANEL_NAME,
        txId: user_client.tx_id
    };
    // send the transaction proposal to the peers
    return user_client.channel.sendTransactionProposal(request)
        .then((results) => {
            let proposalResponses = results[0];
            let proposal = results[1];
            let header = results[2];

            let isProposalGood = false;
            if (proposalResponses && proposalResponses[0].response &&
                proposalResponses[0].response.status === 200) {
                isProposalGood = true;
                console.log('Transaction proposal was good');
            } else {
                console.error('Transaction proposal was bad');
            }
            if (isProposalGood) {
                console.log(util.format(
                    'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
                    proposalResponses[0].response.status, proposalResponses[0].response.message));

                // build up the request for the orderer to have the transaction committed
                let request = {
                    proposalResponses: proposalResponses,
                    proposal: proposal,
                    header: header
                };

                // set the transaction listener and set a timeout of 30 sec
                // if the transaction did not get committed within the timeout period,
                // report a TIMEOUT status
                let transaction_id_string = user_client.tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
                let promises = [];
                // 클라이언트측의 검증이 올바르다면 Proposal 결과 커밋 요청
                let sendPromise = user_client.channel.sendTransaction(request);
                promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

                // get an eventhub once the fabric client has a user assigned. The user
                // is required bacause the event registration must be signed

                // using resolve the promise so that result status may be processed
                // under the then clause rather than having the catch clause process
                // the status
                let txPromise = new Promise((resolve, reject) => {
                    let event_hub = user_client.event_hubs[0];
                    let handle = setTimeout(() => {
                        event_hub.disconnect();
                        resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
                    }, 3000);
                    event_hub.connect();
                    event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
                        // this is the callback for transaction event status
                        // first some clean up of event listener
                        clearTimeout(handle);
                        event_hub.unregisterTxEvent(transaction_id_string);
                        event_hub.disconnect();

                        // 하이퍼레저 패브릭측에서 검증 결과 확인
                        var return_status = {event_status : code, tx_id : transaction_id_string};
                        if (code !== 'VALID') {
                            console.error('The transaction was invalid, code = ' + code);
                            resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
                        } else {
                            console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
                            resolve(return_status);
                        }
                    }, (err) => {
                        //this is the callback if something goes wrong with the event registration or processing
                        reject(new Error('There was a problem with the eventhub ::'+err));
                    });
                });
                promises.push(txPromise);

                return Promise.all(promises);
            } else {
                console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
                throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
            }
        })
};
