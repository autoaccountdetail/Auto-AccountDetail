const COMMON_MODULES = require('../../common/modules');
const COMMON_CONSTANT= require('../../common/constant');
const bank_api_service = require('../../service/BankApiService');
const bank_comment_service = require('../../service/BankCommantService');
const council_service = require('../../service/CouncilService');
const validater = require('./ReqeustSchema');
const moment = require('moment');


exports.issueToken = async (req, res) => {
    COMMON_MODULES.ENTRY("Register");
    const is_valid = validater.issueToken.validate(req.body);
    if(is_valid.length > 0){
        return res.status(400).json({'error': 1, 'message' :is_valid[0].message});
    }
    const user_id = req.body.user_id;

    //Todo user_id와 code가 일치하는지 확인하는 검증로직 필요
    let token_info = await bank_api_service.getToken(req.body);
    bank_api_service.saveBankToken(user_id, JSON.parse(token_info));
    // let token_info = {"access_token": "Bearer fbb4e14a-5d5e-4510-8840-97208c2e48c7", "user_seq_no": "1100035167"};

    let fintech = await bank_api_service.getFintechByToken(token_info);
    council_service.findById(user_id, "fintech_use_num", fintech);
    return res.status(200).json(fintech);
};


exports.update = async (req, res) => {
    COMMON_MODULES.ENTRY("Bank API Search");
    const is_valid = validater.transaction.validate(req.body);
    if(is_valid.length > 0){
        return res.status(400).json({'error': 1, 'message' :is_valid[0].message});
    }

    let today_transaction = {is_more : true, trans_list : []};
    let bank_param = bank_api_service.makeBankParam(req.body);
    let token = "Bearer " + req.body.access_token;
    let fintech_use_num = req.body.fintech_use_num;
    let union_name = req.body.union_name;

    while (today_transaction.is_more){
        let page_content = await bank_api_service.getTransactionToday(token, bank_param);
        today_transaction.is_more = page_content.is_more;
        today_transaction.trans_list = today_transaction.trans_list.concat(page_content.trans_list);
        bank_param.page_index = bank_param.page_index*1 + 1;
    }

    today_transaction.trans_list = today_transaction.trans_list
        .map( item => {
            item['fintech_use_num'] = fintech_use_num;
            item['union_name'] = union_name;
            return item
        });

    //Todo Invoke 로직 구현

    //bank_comment_service.saveBankComments(bank_param.fintech_use_num, today_transaction.trans_list);

    return res.status(200).json(bank_param);

};

