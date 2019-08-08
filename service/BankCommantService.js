const BankComment = require('../entity/BankComment');

exports.findBankComments = (fintech, is_confirm=false) => {
    return BankComment
        .find({"fintech_use_num": fintech, "is_confirm": is_confirm}, isSuccess);
};

// 댓글 수정
exports.updateBankComment =  (trans_key, comment) => {
    let target_comment = BankComment
        .update(
            {"trans_key": trans_key},
            {"comment": comment, "is_confirm": true},
            isSuccess
        );
    return target_comment
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