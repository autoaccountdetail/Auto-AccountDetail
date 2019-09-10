const app = require('./route');
const port = process.env.PORT || 3000;

const server = app.listen(port, function () {
    console.log("서버 기동 : "+ port);
});