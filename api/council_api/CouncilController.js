const COMMON_MODULES = require('../../common/modules');
const bank_comment_service = require('../../service/BankCommantService');
const fabric_helper = require('../../hyperledger_fabric/fabric_helper');




exports.loadTransactionList = async (req, res) => {
    COMMON_MODULES.ENTRY("loadTransactionList");
    let union_name = req.body.union_name;
    let hf_trasacion = req.body.comment === "true" ? "queryHistorysComment" : "queryHistorysByKeys";
    let hf_args = ["unionName",union_name];
    let user_client = {};

    if(hf_trasacion === "queryHistorysByKeys"){ // 댓글이 없는 녀석 조회
        hf_args.push("comment");
        hf_args.push("");
    }

    console.log("====== Param Check =======");
    console.log(union_name);
    console.log(hf_trasacion);
    console.log(hf_args);

    let tran_list = await fabric_helper.initObject(user_client)
        .then(user_client => fabric_helper.queryByChainCode(user_client, hf_trasacion, hf_args))
        .then( result => {
            return JSON.parse(result[0].toString()).payload.map(
                item => item.Record
            );
        });

    return res.status(200).json(tran_list);
};

//Todo 댓글이 달려있지 않은 내역만 추출


exports.searchComment = async (req, res) => {
    COMMON_MODULES.ENTRY("searchComment");
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