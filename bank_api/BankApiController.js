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
    let bank_param = service.makeBankParam(req.body);
    let token = "Bearer " + req.body.token;

    while (today_transaction.is_more){
        let page_content = await service.getTransactionToday(token, bank_param);
        today_transaction.is_more = page_content.is_more;
        today_transaction.trans_list = today_transaction.trans_list.concat(page_content.trans_list);
        bank_param.page_index = bank_param.page_index*1 + 1;
    }

    service.saveBankComment(bank_param.fintech_use_num, today_transaction.trans_list);

    return res.status(200).json(bank_param);

};