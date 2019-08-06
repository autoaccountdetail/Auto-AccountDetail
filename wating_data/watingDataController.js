const express = require('express');
const router = express.Router();
const async = require('async');
const request = require("request");
const Iconv  = require('iconv').Iconv;
const cheerio = require('cheerio');
const CONSTATNT = require('./../common/constant');
const service = require('./LoginService');

const WaitingData = require('./WaitingData');

exports.login =  async (req, res) => {
    console.log("Entry Login POST");

    let url = CONSTATNT.PLMS_LOGIN_REQUEST_URL;
    let form_param = { id: req.body.id, pswd: req.body.pswd,
        dest: CONSTATNT.PLMS_LOGIN_INDEX_URL };

    let param =  {
            url: url,
            method: "POST",
            form: form_param,
            encoding: null
    };

    const rst = await service.login(param);
    return res.json(rst);
};


router.post('/', function (req,res) {
    console.log("Entry WaitingData Post");
    waitingData = new WaitingData({
        college_key: 1,
        balance_amt: 10000,
        transaction_amt: 2000,
        transaction_type: "WITHDRAW",
        content: "삼각김밥",
        created_date: new Date()
    });
    waitingData.save((error)=>{
        if(error) console.log(error);
        else console.log("Saved!");
    })
});

router.get('/', (req, res) => {
    console.log("Entry WaitingData GET");
    WaitingData.find( {}, (err, waitingDatas) => {
        if(err) return res.status(500).send("User 전체 조회 실패.");
        res.status(200).send(waitingDatas);
    });
});

