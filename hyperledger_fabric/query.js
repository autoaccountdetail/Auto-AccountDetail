/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// call the packages we need
const express       = require('express');        // call express
const Fabric_Client = require('fabric-client');
const path          = require('path');
const CONSTANT = require('../common/constant');

async function main() {
    let fabric_client = new Fabric_Client();

    // setup the fabric network
    let channel = fabric_client.newChannel(CONSTANT.FABRIC_CHANEL_NAME);
    let peer = fabric_client.newPeer(CONSTANT.FABRIC_PEER_URL);
    channel.addPeer(peer);

    //
    var member_user = null;
    const store_path = path.join(__dirname, 'wallet');
    console.log('Store path:'+store_path);
    var tx_id = null;

    // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
    Fabric_Client.newDefaultKeyValueStore({ path: store_path
    }).then((state_store) => {
        // assign the store to the fabric client
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        // use the same location for the state store (where the users' certificate are kept)
        // and the crypto store (where the users' keys are kept)
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);

        // get the enrolled user from persistence, this user will sign all requests
        return fabric_client.getUserContext(CONSTANT.FABRIC_USER_NAME, true);
    }).then((user_from_store) => {
        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded user1 from persistence');
            member_user = user_from_store;
        } else {
            throw new Error('Failed to get user1.... run registerUser.js');
        }

        // queryAllTuna - requires no arguments , ex: args: [''],
        const request = {
            chaincodeId: 'tuna-app',
            txId: tx_id,
            fcn: 'queryAllTuna',
            args: ['']
        };

        // send the query proposal to the peer
        return channel.queryByChaincode(request);
    }).then((query_responses) => {
        console.log("Query has completed, checking results");
        // query_responses could have more than one  results if there multiple peers were used as targets
        if (query_responses && query_responses.length == 1) {
            if (query_responses[0] instanceof Error) {
                console.error("error from query = ", query_responses[0]);
            } else {
                console.log("Response is ", query_responses[0].toString());
            }
        } else {
            console.log("No payloads were returned from query");
        }
    }).catch((err) => {
        console.error('Failed to query successfully :: ' + err);
    });
}

main();
