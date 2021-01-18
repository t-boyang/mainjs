var Parse = require('parse/node');
var underscore = require('underscore');

const parseID = "123456";
const serverURL = "http://localhost:1337/parse"
const LableClassName = "LableClass"

function initializeParse() {
    Parse.initialize(parseID);
    Parse.serverURL = serverURL
}

function create_lable(lableID, userName, lableBody) {
    const lableClass = Parse.Object.extend(LableClassName);
    const lableObject = new lableClass();
    lableObject.set('lableID', lableID);
    lableObject.set('lableUserName', userName);
    lableObject.set('lableBody', lableBody);
    lableObject.save().then(
        (result) => {
            console.log('标签文件 存储完成', result);
            console.log('标签文件 id为 ', result["id"]);
        },
        (error) => {
            console.error('标签文件创建出错: ', error);
        }
    );
}
function get_lable(lableID, lableUserName) {
    const lableClass = Parse.Object.extend(LableClassName);
    const query = new Parse.Query(lableClass);
    query.equalTo("lableUserName", lableUserName);
    query.find().then((results) => {
        const lableResult = results[0];
        console.log("用户:" + lableResult.get('lableUserName') + "的个性化标签为: ");
        const lableBody = lableResult.get("lableBody")["car"];
        for (var i = 0; i < lableBody.length-1; i++) {
            console.log(underscore.values(lableBody[i]));
        }
    }, (error) => {
        console.error('标签文件读取出错: ', error);
    });
}

// 测试标签例子代码
// initializeParse()
// var lableMetadata = {
//     "car": [{
//         "price type": ["luxury cars"]
//     },
//     {
//         "boot type": {
//             "driverless car": ["semi-automatic driverless car", "fully-automatic driverless car"],
//             "manual  car": "simple manual  car"
//         }
//     },
//     {
//         "controlled lable": {
//             "id": 1,
//             "isDelete": "false",
//             "parent_id": 0,
//             "version": "1.0"
//         }
//     }
//     ]
// }
// create_lable(1, "boyang", lableMetadata)
// get_lable(1, "boyang")