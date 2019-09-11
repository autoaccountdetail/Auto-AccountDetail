const COMMON_MODULES = require('../../common/modules');
const Account = require('../../entity/Account');
const fabric_helper = require('../../hyperledger_fabric/fabric_helper');

exports.loadTransactionList = async (req, res) => {
    COMMON_MODULES.ENTRY("loadTransactionList");
    let union_name = req.body.union_name;
    let user_client = {};

    console.log(union_name);

    let tran_list = await fabric_helper.initObject(user_client)
        .then(user_client => fabric_helper.queryByChainCode(user_client, "queryHistorysByKey", ["unionName",union_name]))
        .then( result => {
            return JSON.parse(result[0].toString()).payload.map(
                item => item.Record
            );
        });
    

    tran_list.map( item => {
        console.log(item);
    });


    return res.status(200).json(tran_list);
};
