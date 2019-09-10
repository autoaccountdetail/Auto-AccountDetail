const COMMON_MODULES = require('../../common/modules');
const Account = require('../../entity/Account');

exports.loadTransactionList = async (req, res) => {
    COMMON_MODULES.ENTRY("loadTransactionList");
    let union_name = req.body.union_name;

    // Todo 원장에서 union_name으로 Account 가져오는 로직

    return res.status(200).json(
        new Account(1, "Computer", "199004942057725877163790",
            "20161001", "010101")
    );
};
