var fn = require('./people.js');
var Parse = require('parse/node');
var readlineSync = require('readline-sync');
async = require("async");

const parseID = "123456";
const serverURL = "http://localhost:1337/parse"

function initializeParse() {
    Parse.initialize(parseID);
    Parse.serverURL = serverURL
}

var sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    })
};

var start = async function () {
    initializeParse();
    await sleep(10);
    console.log("parse 初始化完成 欢迎使用资源库");
    console.log("请先登录用户:\n用户名为:");
    username = "";
    password = "";
    var userName = readlineSync.question('');
    console.log("密码为:");
    var passWord = readlineSync.question('');
    var userExample = {
        "userId": "001",
        "loginType": "wechat",
        "username": userName,
        "password": passWord,
        "userType": "created_people"
    };
    fn.create_people(userName, userExample, "program admin");
    await sleep(500);
    fn.get_people(userName);
};
 
start();

// async.series([a, b], function(error, result) {
//     console.log("ok");
// });
// readSyn();
// rl.on('line', function (line) {
//     // TODO: 处理这一行输入 
//     // ...
//     username = line;
//     const r2 = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout
//     })
//     r2.on('line', function (line) {
//         password = line;
//         console.log(password);
//     });
//     rl.close();
// });
// var username = readline.createInterface(process.stdin, process.stdout);
// console.log(username);

// fn.u();
// fn.world("boyang");
// console.log(fn);