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
    console.log(req.body.query.code);
    let auth_code = req.body.query.code;
    return res.status(200).json({"auth_code": auth_code});
};

exports.issueToken = async (req, res) => {
    COMMON_MODULES.ENTRY("Register");
    console.log(req.body);
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

    let fintech = await bank_api_service.getFintechByToken(token_info);

    if(typeof fintech === 'string') {
        council_service.update(user_id, "fintech_use_num", fintech);
    }

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

    let councilByUnion = await council_service.findByUnionName(union_name);
    let fintech_use_num = councilByUnion.fintech_use_num;

    let bank_token = await bank_api_service.findTokenByFintech(councilByUnion.fintech_use_num);
    let token = bank_token.access_token;

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

    today_transaction.trans_list.map(item => {
        fabric_helper.initObject(user_client)
            .then( user_client => fabric_helper.invokeByChainCode(user_client,"addHistory",
                fabric_helper.makeAddHistoryArgs(item)));
    });

    return res.status(200).json(bank_param);

};

