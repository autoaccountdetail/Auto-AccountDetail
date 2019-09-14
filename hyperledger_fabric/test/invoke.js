/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// call the packages we need
const Fabric_Client = require('fabric-client');
const CONSTANT = require('../../common/constant');
const FabricHelper = require('../fabric_helper');
const util = require('util');

async function main() {
    let user_client = {
        "client" : new Fabric_Client(),
        "channel" : null,
        "order" : null,
        "event_hubs" : null,
        "tx_id": null
    };

    let key = "13";
    let timestamp = "4089402184902";
    let location = "22.012, 105.20";
    let vessel = "Hansdwel";
    let holder = "tedwst";

    let args = [ "key21", "tranDate", "tranTime", "inputType", "tranType", "printCount", "tranAmt", "afterBalanceAmt", "branchName", "fintechNum", "unionName1"];


    const store_path = CONSTANT.FABRIC_WALLET_PATH;
    console.log('Store path:'+store_path);

    FabricHelper.initObject(user_client)
        .then(user_client => FabricHelper.invokeByChainCode(user_client, "addHistory", args))
        .then((results) => {
        console.log('Send transaction promise and event listener promise have completed');
        // check the results in the order the promises were added to the promise all list
        if (results && results[0] && results[0].status === 'SUCCESS') {
            console.log('Successfully sent transaction to the orderer.');
            console.log(user_client.tx_id.getTransactionID());
        } else {
            console.error('Failed to order the transaction. Error code: ');
        }

        if(results && results[1] && results[1].event_status === 'VALID') {
            console.log('Successfully committed the change to the ledger by the peer');
            console.log(user_client.tx_id.getTransactionID());
        } else {
            console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
        }
    }) // 결과
        .catch((err) => {
        console.error('Failed to invoke successfully :: ' + err);
    });
}

main();
