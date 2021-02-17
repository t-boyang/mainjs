var Parse = require('parse/node');

const parseID = "123456";
const serverURL = "http://localhost:1337/parse"
const userClassName = "UserClass"

function initializeParse() {
    Parse.initialize(parseID);
    Parse.serverURL = serverURL
}

function create_people(userName, userdataBody, userType) {
    const userParseClass = Parse.Object.extend(userClassName);
    const userObject = new userParseClass();
    userObject.set('username', userName);
    userObject.set('userdataBody', userdataBody);
    userObject.set('userType', userType);
    userObject.save().then(
        (result) => {
            console.log('用户文件 存储完成', result);
            console.log('用户姓名为 ', userName);
        },
        (error) => {
            console.error('用户文件创建出错: ', error);
        }
    );
}

exports.world =  function get_people(userName) {
    const userParseClass = Parse.Object.extend(userClassName);
    const query = new Parse.Query(userParseClass);
    query.equalTo("username", userName);
    query.find().then((results) => {
        const userResult = results[0];
        userName = userResult.get("username");
        userdataBody = userResult.get("userdataBody");
        userType = userResult.get("userType");
        console.log("用户 " + userName + " 其对应的用户数据体为 " +
            JSON.stringify(userdataBody) + "\n用户类型为 " + userType + " 该权限为项目最高权限,可以控制该项目内的所有内容单元");
    }, (error) => {
        console.error('文档文件读取出错: ', error);
    });
}

//initializeParse()

// var userExample = {
//     "userId": "001",
//     "loginType": "wechat",
//     "username": "boyang",
//     "password": "123456",
//     "userType": "created_people"
// }
// //create_people("boyang",userExample,"program admin");
// get_people("boyang")