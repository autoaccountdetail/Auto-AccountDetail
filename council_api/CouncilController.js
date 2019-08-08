const COMMON_MODULES = require('./../common/modules');
const bank_comment_service = require('../service/BankCommantService');


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