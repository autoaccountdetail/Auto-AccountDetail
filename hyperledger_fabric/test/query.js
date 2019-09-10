/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// call the packages we need
const Fabric_Client = require('fabric-client');
const CONSTANT = require('../../common/constant');
const FabricHelper = require('../fabric_helper');


async function main() {
    let user_client = {
        "client" : new Fabric_Client(),
        "channel" : null,
        "order" : null,
        "event_hubs" : null,
        "tx_id": null
    };
    // const store_path = CONSTANT.FABRIC_WALLET_PATH;
    // console.log('Store path:'+store_path);

    FabricHelper.initObject(user_client)
        .then((ClientObj) => {
            return FabricHelper.queryByChainCode(
                ClientObj, 'queryTuna', ['1'] );
        })
        .then((query_responses) => {
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
