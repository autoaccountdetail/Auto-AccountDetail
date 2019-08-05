const Iconv  = require('iconv').Iconv;
const cheerio = require('cheerio');
const request_promise = require("request-promise-native");

exports.login = (param) => {
    console.log("Service Login");
    return  request_promise(param).then(validateLogin);
};

function validateLogin(body){

    let loginResult = false;
    let strContents = new Buffer(body, 'binary');
    iconv = new Iconv('euc-kr', 'UTF8');
    let html = iconv.convert(strContents).toString('utf-8');
    const $ = cheerio.load(html);
    let values = $('input[name="gbn"]');

    if (values[0].attribs.value === "True")
        loginResult = true;

    return loginResult;
};






