const fs = require('fs');
const path = require('path');

function removeFileExtension(filename) {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
}

const notNeedDirectory = [
    '..测试'
    , '.vscode'
    , '.reference'
    , 'asset'
    , 'markdown'];
const notNeedFile = ['index.html'
    , 'LICENSE'
    , 'nav.json'
    , 'README.md'
    , 'output to nav.js'
    , 'favicon.ico'
    , '.gitignore'];
// 递归遍历目录并生成JSON结构
function generateJson(dirPath, basePath = '') {
    const result = [];

    const items = fs.readdirSync(dirPath);
    for (const item of items) {
        const itemPath = path.join(dirPath, item);
        if (notNeedDirectory.indexOf(itemPath) > -1) {
            continue;
        }
        if (notNeedFile.indexOf(itemPath) > -1) {
            continue;
        }
        const itemStat = fs.statSync(itemPath);
        if (itemStat.isDirectory()) {
            result.push({
                类型: '文件夹',
                名称: item,
                路径: path.join(basePath, item),
                子项: generateJson(itemPath, path.join(basePath, item))
            });
        } else {
            result.push({
                类型: path.extname(item).slice(1) || '文件',
                名称: removeFileExtension(item),
                路径: path.join(basePath, item)
            });
        }
    }

    return result;
}

// 使用示例
const directoryPath = './';
const jsonResult = generateJson(directoryPath);

// 将结果写入文件
const outputFilePath = './nav.json';
fs.writeFileSync(outputFilePath, JSON.stringify(jsonResult, null, 4), 'utf-8');

console.log(`JSON结果已写入文件：${outputFilePath}`);