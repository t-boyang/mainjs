var Parse = require('parse/node');
const fs = require('fs');
const path = require('path');

const parseID = "123456";
const serverURL = "http://localhost:1337/parse"
const documentClassName = "DocumentClass"
const documentFileName = "script.xml"

function initializeParse() {
    Parse.initialize(parseID);
    Parse.serverURL = serverURL
}

function create_document(userName, documentID, metadataBody, fileNameArrays) {
    const fileLength = fileNameArrays.length;
    const documentClass = Parse.Object.extend(documentClassName);
    const documentObject = new documentClass();
    documentObject.set('documentID', documentID);
    documentObject.set('userName', userName);
    documentObject.set('metadataBody', metadataBody);
    const documentFile = fs.readFileSync(documentFileName, "base64");
    documentObject.set('documentFile', new Parse.File(documentFileName, { base64: documentFile }));
    documentObject.set('documentFileNumbers', fileLength);
    documentObject.save().then(
        (result) => {
            console.log('文档文件 存储完成', result);
            console.log('文档文件 id为 ', result["id"]);
        },
        (error) => {
            console.error('文档文件创建出错: ', error);
        }
    );
}
function get_document(userName, documentID) {
    const documentClass = Parse.Object.extend(documentClassName);
    const query = new Parse.Query(documentClass);
    query.equalTo("userName", userName);
    query.equalTo("documentID", documentID);
    query.find().then((results) => {
        const documentResult = results[0];
        documentID=documentResult.get("documentID");
        userName=documentResult.get("userName");
        metadataBody=documentResult.get("metadataBody");
        documentFile=documentResult.get("documentFile");
        documentFileNumbers=documentResult.get("documentFileNumbers");
        console.log("文档 "+documentID+" 属于用户 "+userName+" 其文档元数据为 "+
        JSON.stringify(metadataBody)+"\n内容模块文件名为 "+documentFileName+" 内容模块数量为 "+documentFileNumbers);
    }, (error) => {
        console.error('文档文件读取出错: ', error);
    });
}

function streamMerge(sourceFiles, targetFile) {
    const scripts = fs.readdirSync(path.resolve(__dirname, sourceFiles)); // 获取源文件目录下的所有文件
    const fileWriteStream = fs.createWriteStream(path.resolve(__dirname, targetFile)); // 创建一个可写流
    streamMergeRecursive(scripts, fileWriteStream);
}

function streamMergeRecursive(scripts = [], fileWriteStream) {
    // 递归到尾部情况判断
    if (!scripts.length) {
        return fileWriteStream.end(" "); // 最后关闭可写流，防止内存泄漏
    }
    const currentFile = path.resolve(__dirname, 'scripts/', scripts.shift());
    const currentReadStream = fs.createReadStream(currentFile); // 获取当前的可读流
    currentReadStream.pipe(fileWriteStream, { end: false });
    currentReadStream.on('end', function () {
        streamMergeRecursive(scripts, fileWriteStream);
    });
    currentReadStream.on('error', function (error) { // 监听错误事件，关闭可写流，防止内存泄漏
        console.error(error);
        fileWriteStream.close();
    });
}

// 测试例子代码
// streamMerge('./scripts', './script.xml');
initializeParse()
get_document("boyang", 001);
// var metadataBody = {
//     "id": 1,
//     "type": "manage",
//     "name": "myMetaData",
//     "description": "这是一个元数据类型实例",
//     "needShowNote": true,
//     "screen": {
//         "screenType": "mobilePhone",
//         "screenLength": 5.5,
//         "screenResolutionRatio": "1920*1080"
//     }
// }
// var mobile_arr = new Array("./scripts/A.xml", "./scripts/B1.xml", "./scripts/C.xml");
// var web_arr = new Array("A.xml", "B2.xml", "C.xml");
// create_document("boyang", 001, metadataBody, mobile_arr)