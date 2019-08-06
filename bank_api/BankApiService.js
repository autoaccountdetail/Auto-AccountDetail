const BankComment = require('./BankComment');
const COMMON_CONSTANT= require('./../common/constant');
const Iconv  = require('iconv').Iconv;
const cheerio = require('cheerio');
const request_promise = require("request-promise-native");
const moment = require('moment');

// 공동은행 거래내역 조회를 위한 parameter를 생성합니
exports.makeBankParam = (request_body) =>{
    let bank_param = {... request_body }; // 불변성보장
    bank_param.page_index = "page_index" in bank_param ? bank_param.page_index : "1";
    bank_param.tran_dtime = moment().format("YYYYMMDDHHmmss");
    bank_param.sort_order = "D";
    delete bank_param.token;
    return bank_param;
};

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

// mongo에 조회된 내역을 저장합니다.
exports.saveBankComment = (fintech, transaction_list) => {
    bankComments = transaction_list.map(
        tran => {
            return {
                trans_key :tran.tran_date + tran.tran_time +  fintech,
                comment : "",
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