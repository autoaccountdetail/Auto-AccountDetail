const mongoose =require('mongoose');

const BankComment = new mongoose.Schema({
    trans_key : String, // 거래날짜+거래시간+핀테크번호
    comment : String,
    is_confirm : Boolean,
    created_date : Date
});


mongoose.model('BankComment', BankComment);
module.exports = mongoose.model('BankComment');