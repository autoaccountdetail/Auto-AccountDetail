const CONSTATNT = require('../common/constant');
const Iconv  = require('iconv').Iconv;
const cheerio = require('cheerio');
const request_promise = require("request-promise-native");

exports.login = (id, pswd) => {
    console.log("Service Login");
    let url = CONSTATNT.PLMS_LOGIN_REQUEST_URL;
    let form_param = { id: id, pswd: pswd,
        dest: CONSTATNT.PLMS_LOGIN_INDEX_URL };

    let param =  {
        url: url,
        method: "POST",
        form: form_param,
        encoding: null
    };

    return  request_promise(param).then(validateLogin);
};

function validateLogin(body){

    let loginResult = {};
    let strContents = new Buffer(body, 'binary');
    iconv = new Iconv('euc-kr', 'UTF8');
    let html = iconv.convert(strContents).toString('utf-8');
    const $ = cheerio.load(html);
    let values = $('input[name="gbn"]');

    if (values[0].attribs.value === "True"){
        let student_name = $('input[name="name"]')[0].attribs.value;
        let user_id = $('input[name="userid"]')[0].attribs.value;
        loginResult['student_name'] = student_name;
        loginResult['user_id'] = user_id;
        loginResult['msg'] = "로그인 성공";
    } else {
        loginResult['msg'] = "로그인 실패";
    }


    return loginResult;
}






