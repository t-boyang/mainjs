var Parse = require('parse/node');

const parseID = "123456";
const serverURL = "http://localhost:1337/parse"
const MetadataClassName = "MetadataClass"

function initializeParse() {
    Parse.initialize(parseID);
    Parse.serverURL = serverURL
}

function create_metadata(metadataID, userName, metadataBody) {
    const metadataClass = Parse.Object.extend(MetadataClassName);
    const metadataObject = new metadataClass();
    metadataObject.set('MetadataID', metadataID);
    metadataObject.set('MetadataUserName', userName);
    metadataObject.set('MetadataBody', metadataBody);
    metadataObject.save().then(
        (result) => {
            console.log('元数据文件 存储完成', result);
            console.log('元数据文件 id为 ', result["id"]);
        },
        (error) => {
            console.error('元数据文件创建出错: ', error);
        }
    );
}
function get_system_metadata(metadataSystemID) {
    const metadataClass = Parse.Object.extend(MetadataClassName);
    const query = new Parse.Query(metadataClass);
    query.find().then((results) => {
        const metadataResult = results[0];
        console.log("系统: " + metadataSystemID + "的元数据为: ");
        const metadataBody = metadataResult.get("MetadataBody");
        console.log(metadataBody);
    }, (error) => {
        console.error('元数据文件读取出错: ', error);
    });
}
function get_metadata_by_id(metadataID) {
    const metadataClass = Parse.Object.extend(MetadataClassName);
    const query = new Parse.Query(metadataClass);
    query.equalTo("MetadataID", metadataID);
    query.find().then((results) => {
        const metadataResult = results[0];
        console.log("元数据ID: " + metadataID);
        const metadataBody = metadataResult.get("MetadataBody");
        console.log(metadataBody);
    }, (error) => {
        console.error('元数据文件读取出错: ', error);
    });
}
function delete_metadata_by_id(metadataID) {

}
function change_metadata(metadataID, userName, metadataBody) {

}
// 测试标签例子代码
initializeParse()
var metadata = {
    "id": 1,
    "type": "manage",
    "name": "myMetaData",
    "description": "这是一个元数据类型实例",
    "needShowNote": true,
    "screen": {
        "screenType": "mobilePhone",
        "screenLength": 5.5,
        "screenResolutionRatio": "1920*1080"
    }
}
// create_metadata(1, "boyang", metadata)
get_metadata("001")
