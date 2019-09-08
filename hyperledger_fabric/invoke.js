/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// call the packages we need
const Fabric_Client = require('fabric-client');
const CONSTANT = require('../common/constant');
const FabricHelper = require('./fabric_helper');


async function main() {
    let fabric_client = new Fabric_Client();
    let testObj = "11-28.012,%20105.20-4089402184902-Hansel-test";
    let key = "12";
    let timestamp = "4089402184902";
    let location = "28.012, 105.20";
    let vessel = "Hansel";
    let holder = "test";

    var member_user = null;
    const store_path = CONSTANT.FABRIC_WALLET_PATH;
    console.log('Store path:'+store_path);

    FabricHelper.initObject(fabric_client)
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
