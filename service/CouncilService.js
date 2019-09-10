const Council = require('../entity/Council');

exports.update = (user_id, field_name, value) => {
    let target_council = findById(user_id);
    target_council[field_name] = value;
    target_council.save((err) => console.log(err));
};

exports.findByIdAndPassword = (user_id, password) => {
    return Council.find({"id": user_id, "password": password}, (err, docs) => {
        if(err)
            return "로그인 실패";
        return "로그인 성공";
    });
};

exports.findById = (user_id) => {
    return Council.find()
        .where('id').equals(user_id);
};

