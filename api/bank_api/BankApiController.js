const COMMON_MODULES = require('../../common/modules');
const bank_api_service = require('../../service/BankApiService');
const council_service = require('../../service/CouncilService');
const validater = require('./ReqeustSchema');
const fabric_helper = require('../../hyperledger_fabric/fabric_helper');


exports.issueAuthCodeURL = async (req, res) => {
    COMMON_MODULES.ENTRY("issueAuthCodeURL");
    let auth_code_url = await bank_api_service.getAuthUrl();
    auth_code_url = JSON.parse(auth_code_url);
    console.log(auth_code_url);
    return res.status(200).json(auth_code_url);
};

exports.saveAuthCode = async (req, res) => {
    COMMON_MODULES.ENTRY("saveAuthCode");
    console.log(req);
    console.log(req.body.query);
    let auth_code = req.body.query.code;

};

exports.issueToken = async (req, res) => {
    COMMON_MODULES.ENTRY("Register");
    const is_valid = validater.issueToken.validate(req.body);
    if(is_valid.length > 0){
        return res.status(400).json({'error': 1, 'message' :is_valid[0].message});
    }
    const user_id = req.body.user_id;

    //Todo fintech_use_num와 code가 일치하는지 확인하는 검증로직 필요
    let token_info = await bank_api_service.getToken(req.body);
    token_info = JSON.parse(token_info);
    console.log("=========Token ============");
    console.log(token_info);
    bank_api_service.saveBankToken(user_id, token_info);
    // let token_info = {"access_token": "e30fe977-6e60-41f5-9ac9-a3c66a4c3e4b", "user_seq_no": "1100035167", "test": "..."};

    let fintech = await bank_api_service.getFintechByToken(token_info);
    council_service.findById(user_id);
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
    let user_client = {};
    let union_name = req.body.union_name;
    let token = "Bearer " + req.body.access_token;
    let fintech_use_num = req.body.fintech_use_num;

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
    today_transaction.trans_list.map(item => {
        fabric_helper.initObject(user_client)
            .then( user_client => fabric_helper.invokeByChainCode(user_client,"addHistory",
                fabric_helper.makeAddHistoryArgs(item)));
    });

    return res.status(200).json(bank_param);

};

