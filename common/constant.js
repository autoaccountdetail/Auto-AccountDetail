const path = require('path');
const os = require('os');

module.exports = Object.freeze({
    PLMS_LOGIN_REQUEST_URL: 'https://onestop.pusan.ac.kr/new_pass/exorgan/exidentify.asp',
    PLMS_LOGIN_INDEX_URL: 'https://plms.pusan.ac.kr/studentLogin/index.php',
    BANK_API_TRANSACTION_URL: ' https://testapi.open-platform.or.kr/account/transaction_list',
    BANK_API_ISSUE_TOKEN_URL: 'https://testapi.open-platform.or.kr/oauth/2.0/token',
    BANK_API_ACCOUT_URL: ' https://testapi.open-platform.or.kr/v1.0/user/me',
    BANK_CLIENT_KEY: 'l7xx84bb5a92a3f9493eac00214e8b5a2ab4',
    BANK_CLIENT_SECRET: '53ffb1d8332d466f9391d6a53f1dde01',
    BANK_API_SCOPE: 'login inquiry transfer',
    BANK_API_GRANT_TYPE: 'authorization_code',
    BANK_API_AUTH_URL: ' https://testapi.open-platform.or.kr/oauth/2.0/authorize2',
    BANK_API_AUTH_REDIRECT_URL: 'http://localhost:3000/account/check',
    FABRIC_CA_URL: 'http://35.243.78.192:7054',
    FABRIC_PEER_URL: 'grpc://35.243.78.192:7051',
    FABRIC_ODERER_URL: 'grpc://35.243.78.192:7050',
    FABRIC_CA_NAME: 'ca.example.com',
    FABRIC_CHANEL_NAME: 'mychannel',
    FABRIC_USER_NAME: 'user1002',
    FABRIC_WALLET_PATH: path.join(__dirname, '..', 'hyperledger_fabric', 'wallet'),
    FABRIC_CHAIN_CODE_ID: 'history'
});

