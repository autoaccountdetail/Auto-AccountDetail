const service = require('../../service/LoginService');


exports.login =  async (req, res) => {
    console.log("Entry Login POST");
   let id =  req.body.id;
   let pswd = req.body.pswd;

   // 학생회 계정 로그인 로직 필요, id의 @ 가 포함되냐, 안되냐로 구분

    const rst = await service.login(id, pswd);
    return res.status(200).json(rst);
};


