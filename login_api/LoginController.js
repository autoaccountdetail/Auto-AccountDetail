const express = require('express');
const router = express.Router();
const async = require('async');
const request = require("request");
const Iconv  = require('iconv').Iconv;
const cheerio = require('cheerio');
const CONSTATNT = require('./../common/constant');
const service = require('../service/LoginService');

const WaitingData = require('../entity/WaitingData');

exports.login =  async (req, res) => {
    console.log("Entry Login POST");
   let id =  req.body.id;
   let pswd = req.body.pswd;

    const rst = await service.login(id, pswd);
    return res.status(200).json(rst);
};


