const mongoose =require('mongoose');

const BankComment = new mongoose.Schema({
    trans_key: String, // 거래날짜+거래시간+핀테크번호
    fintech_use_num: String, // 학생회 조인 키
    comment: String,
    is_confirm: Boolean, // 코멘트 확인 여부
    created_date: {type: Date, default: Date.now}
});


mongoose.model('BankComment', BankComment);
module.exports = mongoose.model('BankComment');