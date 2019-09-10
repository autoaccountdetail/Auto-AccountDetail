const Schema = require('validate');

exports.issueToken = new Schema({
    "code": { // 사용자 인증코드
        type: String,
        required: true
    },
    "redirect_uri": { // 콜백 url, 현재는 http://localhost:8080/BankAPi/html/callback.html 로 요청
        type: String,
        required: true
    },
    "user_id": { // 계좌인증을 진행할 유저 id, ex) test
        type: String,
        required: true
    }
});

exports.transaction = new Schema({
    "access_token": { // Access Token, ex) fbb4e14a-5d5e-4510-8840-97208c2e48c7
        type: String,
        required: true
    },
    "fintech_use_num": { // 핀테크 번호, ex) 199004942057725877163790
        type: String,
        required: true
    },
    "inquiry_type": { // 입출금 타입, 모두 : A, 입금 : I, 출금 : O
        type :String,
        required : true
    },
    "from_date": { // 조회시작 일자 ex) 20151001
        type :String,
        required : true
    },
    "to_date": { // 조회종료 일자 ex) 20190626
        type :String,
        required : true
    },
    "page_index": { // 보내지 않아도 됨
        type : String
    },
    "union_name": {
        required : true,
        type : String // 부산대학교 공대 정보컴퓨터 공학부
    }
});

