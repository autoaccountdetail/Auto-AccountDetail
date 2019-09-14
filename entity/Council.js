const mongoose =require('mongoose');

// 학생회 계정
//Todo 계좌정보는 어떻게 관리?
const Council = new mongoose.Schema({
    id: String,
    password: String, //Todo 암호화 과정 필요
    union_name: String, // 소속 단대 및 단과
    fintech_use_num : {type: String, default: ""}, // 핀테크번호
    created_date: {type: Date, default: Date.now}
});

mongoose.model('Council', Council);
module.exports = mongoose.model('Council');