const BankCommentService = require('../service/BankCommantService');

class History {
    constructor(key, union_name, fintech_use_num,
                tran_date, tran_time, input_type,
                content, tran_amount, after_amount, is_comment
                ) {
        this.key = key;
        this.union_name= union_name;
        this.fintech_use_num = fintech_use_num;
        this.tran_date = tran_date;
        this.tran_time= tran_time;
        this.input_type= input_type;
        this.content= content;
        this.tran_amount= tran_amount;
        this.after_amount= after_amount;
        this.is_comment= is_comment;
    }

    getCommentKey() {
        return  this.tran_date
            + this.tran_time + this.fintech_use_num;
    }

}



module.exports = History;
