const mongoose =require('mongoose');

// 학생회 계정
const Council = new mongoose.Schema({
    id: String,
    password: String, //Todo 암호화 과정 필요
    union_name: String, // 소속 단대 및 단과
    fintech_use_num : {type: String, default: ""}, // 핀테크번호
    state_msg: {type: String, default: "등록된 상태메시지가 없습니다"},
    created_date: {type: Date, default: Date.now},
});

mongoose.model('Council', Council);
module.exports = mongoose.model('Council');