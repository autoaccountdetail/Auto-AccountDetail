const mongoose =require('mongoose');
const WaitingDataSchema = new mongoose.Schema({
    college_key: Number, // 학교 키
    balance_amt : Number, // 통장 잔액
    transaction_amt : Number, // 거래 금액
    transaction_type : String, // 거래 타입 : 입금/출금
    content : String, // 거래내용
    created_date : Date
});
mongoose.model('WaitingData',WaitingDataSchema);

module.exports = mongoose.model('WaitingData');