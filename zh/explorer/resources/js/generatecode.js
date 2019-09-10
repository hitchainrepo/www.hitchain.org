;
'use strict';

var templateFiles = {};
var generatedFiles = {files:{group:{fileName:""}}};

function addTemplate(name, content){
    templateFiles[name] = content;
}

function getTemplateFile(name){
    return templateFiles[name];
}

function generateFiles(utilJs){
    eval(utilJs);
    return generatedFiles;
}

function generateFilesByProject(project){
    var utilJs = "";
    for(var i=0; i<project.files.length; i++){
        var file = project.files[i];
        if(file.fileName == "util.js"){
            utilJs = file.fileContent.content;
            continue;
        }
        addTemplate(file.fileName, file.fileContent.content);
    }
    return generateFiles(utilJs);
}
