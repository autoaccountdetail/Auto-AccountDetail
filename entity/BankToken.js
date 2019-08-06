const mongoose =require('mongoose');

const BankToken = new mongoose.Schema({
    access_token: String,
    refresh_token: String,
    expires_in: Number,
    user_seq_no: Number,
    user_id : String, // 학생회 조인키
    created_date: {type: Date, default: Date.now}
});


mongoose.model('BankToken', BankToken);
module.exports = mongoose.model('BankToken');