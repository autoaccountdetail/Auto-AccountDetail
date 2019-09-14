const service = require('../../service/LoginService');


exports.login =  async (req, res) => {
    console.log("Entry Login POST");
   let id =  req.body.id;
   let pswd = req.body.pswd;
   let rst = '';

   // 학생회 계정 로그인 로직 필요, id의 @ 가 포함되냐, 안되냐로 구분
    if (id.indexOf("@") === -1) // 고치기
        rst = await service.councilLogin(id, pswd);
    else
        rst = await service.studentLogin(id, pswd);


    return res.status(200).json(rst);
};

exports.join = async (req, res) => {
    console.log(req.body);
    let id = req.body.id;
    let pswd = req.body.pswd;
    let union_name = req.body.union_name;
    console.log(id);
    service.councilJoin(id, pswd, union_name);

    let rst = {"msg" : "회원가입에 성공했습니다."};
    return res.status(200).json(rst);

};
