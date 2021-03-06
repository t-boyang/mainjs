var Parse = require('parse/node');
var fs = require("fs");
var request = require('request');
var path = require("path");
var urls = path.resolve('./');

const parseID = "123456";
//const parseKey = "a4nVyz0skRTy4yJsoNh8ygX0oBuH9EiRl1mh6xBA";
const serverURL = "http://localhost:1337/parse"
const TemplateClassName = "TemplateClass"

function initializeParse() {
  Parse.initialize(parseID); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
  Parse.serverURL = serverURL
  console.log("parse 连接成功")
}//配置parse登录信息

function downloadFile(uri, filename) {
  var stream = fs.createWriteStream(filename);
  request(uri).pipe(stream);
}

function make_template(object, templateID, templateFileName, templateMetadata, templateImageName, sign) {
  var templateFile=null;
  if (sign != true) {
    templateFile = fs.readFileSync(templateFileName, "base64");
    console.log("模板文件读取完成");
  }

  object.set('templateID', templateID);
  if (sign == true) {
    object.set('templateFile', templateFileName);
  } else {
    object.set('templateFile', new Parse.File(templateFileName, { base64: templateFile }));
  }
  object.set('templateMetadata', templateMetadata);

  if (templateImageName != null) {
    if (sign == true) {
      object.set('templateImageFile', templateImageName);
    } else {
      const templateImageFile = fs.readFileSync(templateImageName, "base64");
      console.log("模板图片读取完成");
      object.set('templateImageFile', new Parse.File(templateImageName, { base64: templateImageFile }));
    }

  }//上传模板图片

} //编辑模板
exports.save_template = function save_template(templateID, templateMetadata, templateFileName, templateImageName, sign) {
  const TemplateClass = Parse.Object.extend(TemplateClassName);
  const templateObject = new TemplateClass();
  const query = new Parse.Query(TemplateClass);
  query.equalTo("templateID", templateID);
  query.find().then((results) => {
    if (typeof document !== 'undefined') document.write(`ParseObjects found: ${JSON.stringify(results)}`);
    const templateResult = results[0];
    if (typeof templateResult == 'undefined') {
      make_template(templateObject, templateID, templateFileName, templateMetadata, templateImageName, sign)
      templateObject.save().then(
        (result) => {
          // if (typeof document !== 'undefined') document.write(`ParseObject created: ${JSON.stringify(result)}`);
          console.log('模板文件 存储完成', result);
          console.log('模板文件 id为 ', result["id"]);
        },
        (error) => {
          if (typeof document !== 'undefined') document.write(`Error while creating ParseObject: ${JSON.stringify(error)}`);
          console.error('Error while creating ParseObject: ', error);
        }
      );
    } else {
      console.log('模板 %d 已经存在', templateID);
    }
  }, (error) => {
    if (typeof document !== 'undefined') document.write(`Error while fetching ParseObjects: ${JSON.stringify(error)}`);
    console.error('Error while fetching ParseObjects', error);
  });


}//存储模板

function delete_template_info(templateID) {
  const TemplateClass = Parse.Object.extend(TemplateClassName);
  const query = new Parse.Query(TemplateClass);
  query.equalTo("templateID", templateID);
  query.find().then((results) => {
    if (typeof document !== 'undefined') document.write(`ParseObjects found: ${JSON.stringify(results)}`);
    const templateResult = results[0];
    if (typeof templateResult !== 'undefined') {
      const templateID = templateResult['id'];
      query.get(templateID).then((object) => {
        object.destroy().then((response) => {
          if (typeof document !== 'undefined') document.write(`Deleted ParseObject: ${JSON.stringify(response)}`);
          console.log('模板删除成功', response);
        }, (error) => {
          if (typeof document !== 'undefined') document.write(`Error while deleting ParseObject: ${JSON.stringify(error)}`);
          console.error('Error while deleting ParseObject', error);
        });
      });
    } else {
      console.error('模板文件不存在');
    }
  }, (error) => {
    if (typeof document !== 'undefined') document.write(`Error while fetching ParseObjects: ${JSON.stringify(error)}`);
    console.error('Error while fetching ParseObjects', error);
  });
}//删除模板

function change_template_info(templateID, templateMetadata, templateFileName, templateImageName) {
  const TemplateClass = Parse.Object.extend(TemplateClassName);
  const query = new Parse.Query(TemplateClass);
  query.equalTo("templateID", templateID);
  query.find().then((results) => {
    if (typeof document !== 'undefined') document.write(`ParseObjects found: ${JSON.stringify(results)}`);
    const templateResult = results[0];
    if (typeof templateResult !== 'undefined') {
      const templateIDBase = templateResult['id'];
      query.get(templateIDBase).then((object) => {

        const templateFile = fs.readFileSync(__dirname + "/" + templateFileName, "base64");
        console.log("模板文件读取完成");
        object.set('templateID', Number(templateID));
        object.set('templateFile', new Parse.File(templateFileName, { base64: templateFile }));
        object.set('templateMetadata', templateMetadata);

        if (templateImageName != null) {
          const templateImageFile = fs.readFileSync(__dirname + "/" + templateImageName, "base64");
          console.log("模板图片读取完成");
          object.set('templateImageFile', new Parse.File(templateImageName, { base64: templateImageFile }));
        }//上传模板图片

        object.save().then((response) => {
          // You can use the "get" method to get the value of an attribute
          // Ex: response.get("<ATTRIBUTE_NAME>")
          if (typeof document !== 'undefined') document.write(`Updated Project: ${JSON.stringify(response)}`);
          console.log('Updated Project', response);
        }, (error) => {
          if (typeof document !== 'undefined') document.write(`Error while updating Project: ${JSON.stringify(error)}`);
          console.error('Error while updating Project', error);
        });
      });
    } else {
      console.error('模板文件不存在');
    }
  }, (error) => {
    if (typeof document !== 'undefined') document.write(`Error while fetching ParseObjects: ${JSON.stringify(error)}`);
    console.error('Error while fetching ParseObjects', error);
  });
}//更新模板信息

exports.get_template_info = function get_template_info(templateID) {
  const TemplateClass = Parse.Object.extend(TemplateClassName);
  const query = new Parse.Query(TemplateClass);
  query.equalTo("templateID", templateID);
  query.find().then((results) => {
    if (typeof document !== 'undefined') document.write(`ParseObjects found: ${JSON.stringify(results)}`);
    const templateResult = results[0];
    if (typeof templateResult !== 'undefined') {
      const templateID = templateResult.get('templateID');
      const templateFile = templateResult.get('templateFile');
      const templateMetadata = templateResult.get('templateMetadata');
      console.log("模板ID为 ", templateID);
      console.log("模板文件url为 ", templateFile["_url"]);
      console.log("模板元数据为 ", templateMetadata);
      const templateImageFile = templateResult.get("templateImageFile");
      if (typeof (templateImageName) != undefined) {
        console.log("模板图片url为 ", templateImageFile["_url"]);
      }
      return templateID;
    } else {
      console.log('模板 %d 不存在', templateID);
    }

  }, (error) => {
    if (typeof document !== 'undefined') document.write(`Error while fetching ParseObjects: ${JSON.stringify(error)}`);
    console.error('Error while fetching ParseObjects', error);
  });
}

function make_content_reuse(templateID, parentTemplateID, reuseType) {
  const TemplateClass = Parse.Object.extend(TemplateClassName);
  const query = new Parse.Query(TemplateClass);
  query.equalTo("templateID", parentTemplateID);
  query.find().then((results) => {
    const templateResult = results[0];
    const newtemplateID = templateResult.get('templateID');
    const templateFile = templateResult.get('templateFile');
    const templateMetadata = templateResult.get('templateMetadata');
    //const templateFileName = templateFile["_name"];
    templateMetadata["reuseType"] = reuseType;
    templateMetadata["parentID"] = parentTemplateID;
    console.log("父ID为 ", newtemplateID);
    console.log("父文件url为 ", templateFile["_url"]);
    // console.log("父文件url为 ", templateFile["_name"]);
    console.log("父元数据为 ", templateMetadata);
    const templateImageFiles = templateResult.get("templateImageFile");
    if (typeof (templateImageName) != undefined) {
      console.log("模板图片url为 ", templateImageFiles["_url"]);
    }
    //downloadFile(templateFile["_url"],templateFileName);
    //console.log(templateFileName+'下载完毕');
    save_template(templateID, templateMetadata, templateFile, templateImageFiles, true);
    console.log("新模板id为 ", templateID);
  }, (error) => {
    console.error('Error while fetching ParseObjects', error);
  });
}
function delete_content_reuse(templateID, parentTemplateID, reuseType, isDelete) {
  delete_template_info(templateID);
  if (reuseType == "Homologous") {
    delete_template_info(parentTemplateID);
  }
  if (reuseType == "reference" && isDelete == true) {
    delete_template_info(parentTemplateID);
  }
}
function update_content_reuse(templateID, isChange, parentTemplateID, reuseType, templateMetadata, templateFileName, templateImageName) {
  const TemplateClass = Parse.Object.extend(TemplateClassName);
  const query = new Parse.Query(TemplateClass);
  query.equalTo("templateID", templateID);
  query.find().then((results) => {
    const templateResult = results[0];
    const templateIDBase = templateResult['id'];
    query.get(templateIDBase).then((object) => {
      const templateFile = fs.readFileSync(__dirname + "/" + templateFileName, "base64");
      object.set('templateID', Number(templateID));
      object.set('templateFile', new Parse.File(templateFileName, { base64: templateFile }));
      object.set('templateMetadata', templateMetadata);
      if (templateImageName != null) {
        const templateImageFile = fs.readFileSync(__dirname + "/" + templateImageName, "base64");
        object.set('templateImageFile', new Parse.File(templateImageName, { base64: templateImageFile }));
      }
      object.save().then((response) => {
        console.log('Updated Project', response);
        if (reuseType == "Homologous") {
          change_template_info(parentTemplateID, templateMetadata, templateFileName, templateImageName);
        }
        if (reuseType == "reference" && isChange == true) {
          change_template_info(parentTemplateID, templateMetadata, templateFileName, templateImageName);
        }
      }, (error) => {
        console.error('Error while updating Project', error);
      });
    });
  }, (error) => {
    console.error('Error while fetching ParseObjects', error);
  });
}

function get_content_reuse(templateID) {
  const TemplateClass = Parse.Object.extend(TemplateClassName);
  const query = new Parse.Query(TemplateClass);
  query.equalTo("templateID", templateID);
  query.find().then((results) => {
    const templateResult = results[0];
    const templateID = templateResult.get('templateID');
    console.log("复用内容单元ID为 ", templateID);
    const templateMetadata = templateResult.get('templateMetadata');
    console.log("复用内容单元的类型为 ", templateMetadata["reuseType"]);
    console.log("复用内容单元的父节点ID为 ", templateMetadata["parentID"]);
  }, (error) => {
    console.error('Error while fetching ParseObjects', error);
  });
}


// // 测试例子代码
// initializeParse()
// //测试模板元数据例子
// var templateMetadata = {
//   "type": "full",
//   "description": "这是汽车启动指南",
//   "isDelete": false,
//   "createTime": "2020-12-15 20:33:39",
//   "parentID": 0,
//   "componentID": 0
// }
// 存入一个模板
// get_content_reuse(800);
//update_content_reuse(700, false, 200, "Homologous", templateMetadata, "resume.xml", "photo.png");
// save_template(888, templateMetadata, "resume.xml", "photo.png");
//make_content_reuse(900, 200, "Homologous");
// delete_content_reuse(700,200,"Homologous",false);
// // 存入一个已经存在的模板 会报错
// save_template(100, templateMetadata, "resume.xml", "photo.png");

// //查询一个不存在模板 会给出不存在的信息 
// get_template_info(888);
// //查询一个已经存在的模板
// get_template_info(100)

// //新的模板元数据
// templateMetadata = {
//   "type": "full",
//   "description": "这是电烤箱使用",
//   "isDelete": false,
//   "createTime": "2020-12-15 20:33:39",
//   "parentID": 0,
//   "componentID": 0
// }

// //修改一个已经存在的模板
// change_template_info(100, templateMetadata, "resume.xml", "photo.png");
// // 修改一个不存在的模板 会给出不存在的信息
// change_template_info(10000000, templateMetadata, "resume.xml", "photo.png");

// //删除一个已经存在的模板
// get_template_info(100);
// // 删除一个不存在的模板 会给出不存在的信息
// delete_template_info(1000000);