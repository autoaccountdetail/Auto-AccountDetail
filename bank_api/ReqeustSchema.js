const Schema = require('validate');

exports.transaction = new Schema({
    "token": {
        type :String,
        required : true
    },
    "fintech_use_num": {
        type :String,
        required : true
    },
    "inquiry_type": {
        type :String,
        // required : true
    },
    "from_date": {
        type :String,
        // required : true
    },
    "to_date": {
        type :String,
        // required : true
    },
    "page_index": {
        type : String
    }
});
