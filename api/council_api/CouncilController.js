const COMMON_MODULES = require('../../common/modules');
const bank_comment_service = require('../../service/BankCommantService');
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

    return res.status(200).json(tran_list);
};

exports.searchComment = async (req, res) => {
    COMMON_MODULES.ENTRY("loadTransactionList");
    const fintech = req.query.fintech_use_num;
    let bank_comment_list = await bank_comment_service.findBankComments(fintech);

    return res.status(200).json(bank_comment_list);
};

exports.updateComment = async (req, res) => {
    COMMON_MODULES.ENTRY("updateComment");
    let trans_key = req.query.trans_key;
    await bank_comment_service.updateBankComment(trans_key, "modified");

    return res.status(200).json("업데이트 성공");
};