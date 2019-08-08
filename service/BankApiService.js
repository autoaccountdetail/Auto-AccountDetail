const BankComment = require('../entity/BankComment');
const BankToken = require('../entity/BankToken');
const COMMON_CONSTANT= require('../common/constant');
const request_promise = require("request-promise-native");
const moment = require('moment');


// 공동은행 API에 거래내역 요청
exports.getTransactionToday = (token, bank_param) => {
    let param = {
        url : COMMON_CONSTANT.BANK_API_TRANSACTION_URL,
        headers : {
            "Authorization" : token
        },
        method: "GET",
        qs : bank_param
    };
    return request_promise(param).then((exportToday));
};

// access token 정보을 얻어옵니다.
exports.getToken = ({code, redirect_uri}) => {
    let issue_param = {
        "code": code,
        "redirect_uri": redirect_uri,
        "client_id": COMMON_CONSTANT.BANK_CLIENT_KEY,
        "client_secret": COMMON_CONSTANT.BANK_CLIENT_SECRET,
        "grant_type": COMMON_CONSTANT.BANK_API_GRANT_TYPE
    };

    let request_param = {
        url : COMMON_CONSTANT.BANK_API_ISSUE_TOKEN_URL,
        headers : {
            "Sec-Fetch-Mode": "cors",
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": "http://localhost:8080/BankAPi/html/authorize2.html"
        },
        method: "POST",
        form : issue_param
    };
    return request_promise(request_param).then((body) => body);
};

// 공동은행 거래내역 조회를 위한 parameter를 생성합니다
exports.makeBankParam = (request_body) =>{
    let bank_param = {... request_body }; // 불변성보장
    bank_param.page_index = "page_index" in bank_param ? bank_param.page_index : "1";
    bank_param.tran_dtime = moment().format("YYYYMMDDHHmmss");
    bank_param.sort_order = "D";
    delete bank_param.access_token;
    return bank_param;
};

// BankToken을 저장합니다.
exports.saveBankToken = (user_id, token) => {
    let bank_toekn = new BankToken({...token, user_id : user_id});
    bank_toekn.save(error => {
        if(error) console.log(error);
    });
};

exports.getFintechByToken = ({access_token, user_seq_no}) => { // 구조체 해제방법 사용
    let param = {
        url : COMMON_CONSTANT.BANK_API_ACCOUT_URL,
        headers : {
            "Authorization" : access_token
        },
        method: "GET",
        qs : {"user_seq_no" : user_seq_no}
    };

    return request_promise(param).then((body) =>{
        let body_json = JSON.parse(body);
        let last = body_json.res_list.length-1;
        return body_json.res_list[last].fintech_use_num;
    });
};


// 거래내역중 오늘에 해당하는 거래내역을 추출합니다.
function exportToday(body) {
    let transaction_list = JSON.parse(body).res_list;
    let test_date = [2016, 9, 1]; // month + 1

    let today_trans = transaction_list
        .filter(item =>{
            return item.tran_date === moment(test_date).format("YYYYMMDD")
        });

    let rst = {};
    rst.trans_list = today_trans;
    rst.is_more = today_trans.length === transaction_list.length;
    rst.is_more = rst.is_more && transaction_list.length === 25;

    return rst;
}

