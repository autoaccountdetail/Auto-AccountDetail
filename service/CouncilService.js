const Council = require('../entity/Council');

exports.findByIdAndPassword = (user_id, password) => {
    return Council.find({"id": user_id, "password": password}, (err, docs) => {
        if(err)
            return "로그인 실패";
        return "로그인 성공";
    });
};

exports.findById = (user_id) => {
    return Council.findOne()
        .where('id').equals(user_id);
};

exports.update = async (user_id, field_name, value) => {
    let target_council = await this.findById(user_id);
    target_council[field_name] = value;
    console.log("===== Update =====");
    console.log(target_council);
    target_council.save((err) => console.log(err));
};


exports.findByUnionName = (union_name) => {
    return Council.findOne({"union_name": union_name},(err, docs) => {
        if(err)
            return "Union 정보가 존재하지 않습니다.";
        return "성공";
    })
};

exports.findDTOByUnionName = (union_name) => {
    return Council.findOne({"union_name": union_name},
        ["union_name", "fintech_use_num", "state_msg"],(err, docs) => {
        if(err)
            return "Union 정보가 존재하지 않습니다.";
        return "성공";
    })
};

exports.makeDTO = ({fintech_use_num, state_msg, union_name}) => {
    return {
        "major": union_name,
        "fintech_use_num": fintech_use_num,
        "body": state_msg
    }
};

