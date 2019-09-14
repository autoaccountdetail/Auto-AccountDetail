const BankComment = require('../entity/BankComment');
const fabric_helper = require('../hyperledger_fabric/fabric_helper');

//
exports.findByTranKey = (bank_comment_key) => {
    return BankComment
        .find({"trans_key" : bank_comment_key}, isSuccess);
};


// 핀 번호로 BankComment 리스트 조회
exports.findBankComments = (fintech, is_confirm=false) => {
    return BankComment
        .find({"fintech_use_num": fintech, "is_confirm": is_confirm}, isSuccess);
};

// 댓글 수정
exports.updateBankComment =  (trans_key, comment) => {
    let user_client = {};
    fabric_helper.initObject(user_client)
        .then( user_client => fabric_helper.invokeByChainCode(user_client,"registerComment",
            ["key", trans_key, "comment", comment]));
    return "success";
};

exports.saveBankComments = (fintech, transaction_list) => {
    bankComments = transaction_list.map(
        tran => {
            return {
                trans_key: tran.tran_date + tran.tran_time +  fintech,
                fintech_use_num: fintech,
                comment: "",
                is_confirm: false,
                create_date: new Date()
            }
        }
    );

    BankComment.insertMany(bankComments, function(error, docs) {
        if(error != null)
            console.log(error);
    });
};

function isSuccess(err, response) {
    if(err){
        console.log("No Find Error: ");
        console.log(err);
    }else{
        console.log(response);
    }
}