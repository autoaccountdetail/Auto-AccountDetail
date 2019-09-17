const COMMON_MODULES = require('../../common/modules');
const bank_comment_service = require('../../service/BankCommantService');
const council_service = require('../../service/CouncilService');
const fabric_helper = require('../../hyperledger_fabric/fabric_helper');




exports.loadTransactionList = async (req, res) => {
    COMMON_MODULES.ENTRY("loadTransactionList");
    let union_name = req.query.union_name;
    let hf_trasacion = req.query.comment === "true" ? "queryHistorysComment" : "queryHistorysByKeys";
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
    console.log(tran_list);
    return res.status(200).json(tran_list);
};

exports.loadCouncil = async (req, res) => {
    COMMON_MODULES.ENTRY("loadCouncil");
    let major_split = req.query.councils.split(" ");
    let major_list = [major_split[0]];
    let council_list = [];

    for (let i = 1; i < major_split.length; i++) {
        major_list.push(major_list[i-1] + ' ' + major_split[i]);
    }

    for (let i = 1; i < major_list.length; i++) {
        let council = await council_service.findDTOByUnionName(major_list[i]);
        council_list.push(council);
    }
    console.log("==========");
    console.log(council_list);

    return res.status(200).json({"test": major_split});
};

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