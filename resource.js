var fn = require('./people.js');
var readline = require('readline'); 

const parseID = "123456";
const serverURL = "http://localhost:1337/parse"

function initializeParse() {
    Parse.initialize(parseID);
    Parse.serverURL = serverURL
}

initializeParse();
console.log("parse 初始化完成 欢迎使用资源库");
console.log("请先登录用户:\n用户名为:");
var username = readline.createInterface(process.stdin, process.stdout);
console.log(username);
console.log("密码为:");
// fn.u();
// fn.world("boyang");
// console.log(fn);