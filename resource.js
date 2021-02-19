var people = require('./people.js');
var label = require('./lable.js');
var content = require('./main.js');
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
    people.create_people(userName, userExample, "program admin");
    await sleep(500);
    people.get_people(userName);
    console.log("请输入需要的标签:");
    var tempLable = readlineSync.question('');
    var i = 100;
    var lableMetadata = {
        tempLable: [{
            "price type": ["luxury cars"]
        },
        {
            "boot type": {
                "driverless car": ["semi-automatic driverless car", "fully-automatic driverless car"],
                "manual  car": "simple manual  car"
            }
        },
        {
            "controlled lable": {
                "id": 1,
                "isDelete": "false",
                "parent_id": 0,
                "version": "1.0"
            }
        }
        ]
    }
    label.create_lable(i, userName, lableMetadata);
    await sleep(500);
    console.log("标签结果为:");
    label.get_lable(i, userName);
    console.log("输入一个内容复用单元ID号：");
    var templateFileID = readlineSync.question('');
    console.log("输入一个内容复用单元文件名：");
    var templateFileName = readlineSync.question('');
    var templateMetadata = {
        "type": "full",
        "description": "这是汽车启动指南",
        "isDelete": false,
        "createTime": "2020-12-15 20:33:39",
        "parentID": 0,
        "componentID": 0
      }; 
      content.save_template(Number(templateFileID), templateMetadata, templateFileName, "photo.png");
      await sleep(500);
      console.log("获取到的内容复用单元结果为："); 
      content.get_template_info(Number(templateFileID));
};
start();