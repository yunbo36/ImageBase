'use strict'
// Dateオブジェクトを作成
var date = new Date();
// UNIXタイムスタンプを取得する (ミリ秒単位)
var a = date.getTime();
// UNIXタイムスタンプを取得する (秒単位 - PHPのtime()と同じ)
var b = Math.floor(a / 1000);
// const { remote } = require('electron');
const sep = process.platform == "win32" ? "\\" : "/";
const { dialog } = require('electron');
const { ipcRenderer } = require('electron');
const fs = require('fs-extra');
const https = require('https');
const path = require('path');
const sqlite3 = require('sqlite3');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const { shell } = require('electron');
const glob = require('glob');
// const fileType = require('file-type');

// const jsSec1 = require('./assets/js/sec1.js');
const jsSec2 = require('./assets/js/sec2.js');
const jsSec3 = require('./assets/js/sec3.js');
const jsSec4 = require('./assets/js/sec4.js');
const jsSec5 = require('./assets/js/sec5.js');
const jsSec9 = require('./assets/js/sec9.js');

// var dbpath, imgpath, pdf1path, pdf2path, pdf3path, dir, filePathLink, partSelArr, diagSelArr, hiDiagSelArr, opProcedure;

window.dialog = dialog;
window.ipcRenderer = ipcRenderer;
window.fs = fs;
window.https = https;
window.path = path;
window.sqlite3 = sqlite3;
window.promisify = promisify;
window.readFile = readFile;
window.shell = shell;

// window.jsSec1 = jsSec1;
window.jsSec2 = jsSec2;
window.jsSec3 = jsSec3;
window.jsSec4 = jsSec4;
window.jsSec5 = jsSec5;
window.jsSec9 = jsSec9;
window.dir = '';
window.dbpath = '';
window.imgpath = '';
window.pdf1path = '';
window.pdf2path = '';
window.pdf3path = '';
window.loginUser = '';
window.loginUserLevel = 0;
// window.fileType = fileType;
window.filePathLink = '';
window.sep = sep;
window.partSelArr = [];
window.diagSelArr = [];
window.hiDiagSelArr = [];
window.opProcedureSelArr = [];
window.diseaseNameSelArr = [];
