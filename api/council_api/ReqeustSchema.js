const Schema = require('validate');

exports.searchComment = new Schema({
    "fintech_use_num": { // 핀테크 번호, ex) 199004942057725877163790
        type: String,
        required: true
    }
});

exports.updateComment = new Schema({
    "trans_key": { // 댓글 고유 아이디,
        type: String,
        required: true
    }
});

