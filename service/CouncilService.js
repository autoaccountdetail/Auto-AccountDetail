const Council = require('../entity/Council');

exports.findById = (user_id) => {
    return Council.find()
        .where('id').equals(user_id);
};

exports.update = (user_id, field_name, value) => {
    let target_council = findById(user_id);
    target_council[field_name] = value;
    target_council.save((err) => console.log(err));
};

