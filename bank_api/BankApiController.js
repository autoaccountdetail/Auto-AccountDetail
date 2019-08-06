const COMMON_MODULES = require('./../common/modules');
const COMMON_CONSTANT= require('./../common/constant');
const service = require('./BankApiService');
const validater = require('./ReqeustSchema');
const moment = require('moment');


exports.update = async (req, res) => {
    COMMON_MODULES.ENTRY("Bank API Search");
    const is_valid = validater.transaction.validate(req.body);
    if(is_valid.length > 0){
        return res.status(400).json({'error': 1, 'message' :is_valid[0].message});
    }

    let today_transaction = {is_more : true, trans_list : []};
    let bank_param = req.body;
    bank_param.page_index = "page_index" in bank_param ? bank_param.page_index : "1";
    bank_param.tran_dtime = moment().format("YYYYMMDDHHmmss");
    bank_param.sort_order = "D";

    let token = "Bearer " + bank_param.token;
    delete bank_param.token;

    let request_param = {
        url : COMMON_CONSTANT.BANK_API_TRANSACTION_URL,
        headers : {
            "Authorization" : token
        },
        method: "GET",
        qs : bank_param
    };

    while (today_transaction.is_more){
        let page_content = await service.getTransactionToday(request_param);
        today_transaction.is_more = page_content.is_more;
        today_transaction.trans_list = today_transaction.trans_list.concat(page_content.trans_list);
        bank_param.page_index = bank_param.page_index*1 + 1;
    }

    service.saveBankComment(bank_param.fintech_use_num, today_transaction.trans_list);

    return res.status(200).json(bank_param);

};