// const { getAppUpdatePublishConfiguration } = require("app-builder-lib/out/publish/PublishManager");
// const { shell } = require("electron");
// const { glob } = require("glob");
const { readyException } = require("jquery");
const { exists } = require("original-fs");
let indexArr = [
    ['patientId', 0, 0],
    ['lastName', 1, 1],
    ['firstName', 1, 1],
    ['birthday', 1, 1],
    ['age', 1, 0],
    ['monthAge', 1, 0],
    ['firstVisitDate', 1, 1],
    ['memo', 1, 1],
    ['sex', 1, 1],
    ['havImage', 1, 0]
];


function firstLoad(sec = "sec1") {

    let mkdate = new Date;

    let promise = new Promise((resolve, reject) => { // #1
        resolve(loadHTML('sec1.html', '#container', 'append'));
    }).then((load) => {
        return new Promise((resolve, reject) => {
            resolve(loadHTML('sec2.html', '#container', 'append'));
        });
    }).then((load) => {
        return new Promise((resolve, reject) => {
            resolve(loadHTML('sec3.html', '#container', 'append'));
        });
    }).then((load) => {
        return new Promise((resolve, reject) => {
            resolve(loadHTML('sec4.html', '#container', 'append'));
        });
    }).then((load) => {
        return new Promise((resolve, reject) => {
            resolve(loadHTML('sec5.html', '#container', 'append'));
        });
    }).then((load) => {
        return new Promise((resolve, reject) => {
            resolve(loadHTML('sec9.html', '#container', 'append'));
        });
    }).then((load) => {
        try {
            getDbAll('tbl_diagnosisName','diagnosis_name').then((res) => {
                diagSelArr = [];

                if (res) {
                    document.getElementById("diagnosis1").innerHTML = '<option value=""></option>';
                    for (let ky in res) {
                        document.getElementById("diagnosis1").innerHTML += '<option value="' + res[ky]['diagnosis_name'] + '">' + res[ky]['diagnosis_name'] + '</option>';
                        diagSelArr[ky] = res[ky]['diagnosis_name'];
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
        try {
            getDbAll('tbl_partCategory').then((res) => {
                
                partSelArr = [];
                if (res) {
                    document.getElementById("part1").innerHTML = '<option value=""></option>';
                    let num = 0;
                    for (let ky in res) {
                        document.getElementById("part1").innerHTML += '<option value="' + res[ky]['part'] + '">' + res[ky]['part'] + '</option>';
                        partSelArr[ky] = res[ky]['part'];
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }

        try {
            getDbAll('tbl_skinPathAndHiDiag').then((res) => {
                hiDiagSelArr = [];

                if (res) {
                    let optData = document.createElement('datalist');
                    optData.setAttribute("id", "diag-list");
                    for (let ky in res) {
                        document.getElementById("diag-list").innerHTML += '<option value="' + res[ky]['pathologyName'] + '"></option>';
                        hiDiagSelArr[ky] = res[ky]['pathologyName'];
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }

        try {
            getDbAll('tbl_opProcedure').then((res) => {
                opProcedureSelArr = [];

                if (res) {
                    for (let ky in res) {
                        opProcedureSelArr[ky] = res[ky]['opProcedure'];
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }

        try {
            getDbAll('tbl_diseaseName').then((res) => {
                diseaseNameSelArr = [];

                if (res) {
                    for (let ky in res) {
                        diseaseNameSelArr[ky] = res[ky]['diseaseName'];
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }

        for (let i = 1960; i <= mkdate.format("Y"); i++) {
            document.getElementById("sec3-entry-year").innerHTML += '<option value="' + i + '">' + i +'</option>';
        }

        return new Promise((resolve, reject) => {
            resolve(loadPage(sec));
        });
    });
    // loadHTML('sec4.html','#container','append');
};


async function findPatient(pid, tblName, odr = 't1.id asc') {
    query = "select * from tbl_patients as t1 left join tbl_" + tblName + " as t2 on t1.patientId = t2.patientId where t1.patientId=? order by ?";
    try {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(dbpath);
            db.all(query, pid, odr, (err, rows) => {
                if (err == null) {
                    resolve(rows);
                }
                else {
                    console.log(err);
                    reject(err);
                }
            });
            db.close();
        });
    } catch (err_1) {
        alert(err_1.message);
    }
}
async function findRinsho(pid, tblName, odr = 't1.id asc') {
    query = "select * from tbl_" + tblName + " where patientId=? order by ?";
    try {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(dbpath);
            db.all(query, pid, odr, (err, rows) => {
                if (err == null) {
                    resolve(rows);
                }
                else {
                    console.log(err);
                    reject(err);
                }
            });
            db.close();
        });
    } catch (err_1) {
        alert(err_1.message);
    }
}

async function searchOnlyPatient(pid) {
    query = "select * from tbl_patients where patientId=?";
    try {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(dbpath);
            db.all(query, pid, (err, rows) => {
                if (err == null) {
                    resolve(rows);
                }
                else {
                    reject(err);
                }
            });
            db.close();
        });
    } catch (err_1) {
        alert(err_1.message);
    }
}

function doit() {
    let ta = document.querySelector('#ta');
    let data = ta.value.split(',');
    addUser(data).then((res) => {
        ta.value = '';
        makeTable();
    });
}

async function loadHTML(html, blockId, insPosi) {
    const render = await readFile(__dirname + '/' + html, 'utf-8');
    const parser = new DOMParser();
    const childrenArray = parser.parseFromString(render, 'text/html').querySelector('body').childNodes;
    const frag = document.createDocumentFragment();

    childrenArray.forEach(item => {
        frag.appendChild(item);
    });

    switch (insPosi) {
        case 'append':
            document.querySelector(blockId).appendChild(frag);
            break;
        case 'prepend':
            document.querySelector(blockId).prepend(frag);
            break;
        case 'empty':
            let blockIds = $(blockId);
            blockIds.empty();
            document.querySelector(blockId).prepend(frag);
            break;
        default:
            break;
    }

    if (document.getElementById('sec2-search-fields') != null) {
        resetSearchForm();
    }
}

function loadPage(sec, reset = false) {

    if (dbpath == "" || imgpath == "") {
        sec = "sec9";
    }

    let el = document.getElementsByClassName('mn-item');
    for (let key in el) {
        if (el.length == el[key]) break;
        let selector = el[key].getAttribute("id");
        if (document.getElementById(selector)) {
            document.getElementById(selector).style.borderColor = "#fff";
        }
        selector = selector.replace("-view", "");
        if (document.getElementById(selector)) {
            document.getElementById(selector).style.display = "none";
        }
    }

    document.getElementById(sec).style.display = "block";
    if (document.getElementById(sec + "-view")) {
        document.getElementById(sec + "-view").style.borderColor = "#5996a9";
    }
    
    if (reset) {
        resetSearchForm("sec2", true);
    }

    if (sec.replace('sec', '') >= 3) {
        if (document.getElementById('sec' + sec.replace('sec', '') + '-msg')) {
            document.getElementById('sec' + sec.replace('sec', '') + '-msg').innerHTML = '';
        }

        window.setTimeout(function () {
            let pidArea = document.querySelector('#' + sec + '-patientId');
            pidArea.focus();
            pidArea.value = '';
            document.execCommand("paste");
            if (isNumber(pidArea.value)) {
                pidArea.select();
                window.setTimeout(function() {
                    switch (sec) {
                        case "sec3":
                            jsSec3.searchByori();
                            break;
                            
                        case "sec4":
                            jsSec4.searchOpe();
                            break;
                            
                        case "sec5":
                            jsSec5.searchMedicalHistory();
                            break;
                    
                        default:
                            break;
                    }                    
                },500);
            }
            else {
                pidArea.value = '';
            }
        }, 500);
        if(sec == "sec9") {
            document.getElementById("fin-msg").innerHTML = "";
            i = 0;
            if (dbpath) {
                document.querySelector("#dbFilePath").value = dbpath;
            }
            if (imgpath) {
                document.querySelector("#imgFilePath").value = imgpath;
            }
            if (pdf1path) {
                document.querySelector("#pdf1FilePath").value = pdf1path;
            }
            if (pdf2path) {
                document.querySelector("#pdf2FilePath").value = pdf2path;
            }
            if (pdf3path) {
                document.querySelector("#pdf3FilePath").value = pdf3path;
            }
            document.getElementById("sec9-img-output-msg").innerHTML = "";
        }
        
    }
    if(sec == "login") {
        let ids;
        if(ids = localStorage.getItem('loginSave')) {
            document.getElementById("ids").value = ids;
            document.getElementById("saveId").checked = true;
        }
    }
    // else if(sec == 'sec1') {
    //     alert(document.getElementById('diagnoshis1').length);
    // }

    return true;
}

function loginCheck() {
    let ids = document.querySelector('#ids').value;
    let passwd = document.querySelector('#passwd').value;

    if (ids.length && passwd.length) {
        loginRun(ids, passwd).then(function (res) {

            sessionStorage.setItem('loginUser', res.displayName);
            sessionStorage.setItem('loginUserLevel', res.admin);
            if(document.getElementById("saveId").checked) {
                localStorage.setItem('loginSave', ids);
            }
            else {
                localStorage.removeItem("saveId");
            }
            loginUserLevel = res.admin;
            // loadHTML('sec1.html', '#container', 'append');
            $("#login").css("display", "none");
            $("#main-nav").css("display", "block");
            $(".hidden-area").css("display", "block");
            if(loginUserLevel) {
                $(".onAdmin").css("display", "block");
                $(".onAdminCell").css("display", "table-cell");
            }
            // $("#sec1").css("display", "block");
            loadPage("sec1");
        });
    }
    else {
        document.getElementById('msgArea').innerHTML = '<strong>IDとパスワードを入力してください。</strong>';
    }
    return false;
}
async function loginRun(ids, passwd) {
    let query = '';
    let res = [];
    query = "select * from tbl_users where name=? and password=?";
    try {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(dbpath);
            db.get(query, ids, passwd, (err, rows) => {
                if (rows != undefined) {
                    resolve(rows);
                }
                else {
                    document.getElementById('msgArea').innerHTML = "<strong>アカウントが存在しません。</strong>";
                    reject(err);
                }
            });
            db.close();
        });
    } catch (err_1) {
        alert(err_1);
    }
}

function doFind() {
    let key = document.querySelector('#inp').value;
    let fstr = document.querySelector('#val').value;
    findUsers(key, fstr).then((res) => {
        let msg = document.querySelector('#sec2-list-table');
        fstr = '';
        msg.innerHTML = resToTable(res);
    });
}

function doDel() {
    let key = document.querySelector('#inp').value;
    let fstr = document.querySelector('#val').value;
    deleteUsers(key, fstr).then((res) => {
        fstr = '';
        makeTable();
    });
}

function addUser(data) {
    return new Promise((resolve, reject) => {
        let db = new sqlite3.Database(dbpath);
        db.serialize(() => {
            let query = 'insert into tbl_users(name,mail,tel) values '
                + '("' + data[0] + '","' + data[1] + '","' + data[2] + '")';
            db.exec(query, (stat, err) => {
                if (err == null) {
                    resolve('SUCCESS');
                }
                else {
                    reject(err);
                }
            });
        });
        db.close();
    });
}

async function addRecord(query,valArr) {

    return new Promise((resolve, reject) => {
        let db = new sqlite3.Database(dbpath);
        db.serialize(() => {
            db.run(query, valArr, (stat, err) => {
                if (err == null) {
                    resolve("データを更新しました");
                }
                else {
                    reject("データの変更は行われませんでした");
                }
            });
        });
        db.close();
    });
}

async function findUsers(key, fstr) {
    let query = '';
    query = "select * from tbl_rinsho where " + key + "=?";
    try {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(dbpath);
            db.all(query, fstr, (err, rows) => {
                if (err == null) {
                    resolve(rows);
                }
                else {
                    reject(err);
                }
            });
            db.close();
        });
    } catch (err_1) {
        alert(err_1.message);
    }
}

async function deleteUsers(key, fstr) {
    let query = '';
    query = "delete from tbl_users where " + key + "=?";
    try {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(dbpath);
            db.run(query, fstr, (err, rows) => {
                if (err == null) {
                    resolve(rows);
                }
                else {
                    reject(err);
                }
            });
            db.close();
        });
    } catch (err_1) {
        alert(err_1.message);
    }
}

function copyTextToClipboard(textVal) {
    // テキストエリアを用意する
    var copyFrom = document.createElement("textarea");
    // テキストエリアへ値をセット
    copyFrom.textContent = textVal;

    // bodyタグの要素を取得
    var bodyElm = document.getElementsByTagName("body")[0];
    // 子要素にテキストエリアを配置
    bodyElm.appendChild(copyFrom);

    // テキストエリアの値を選択
    copyFrom.select();
    // コピーコマンド発行
    var retVal = document.execCommand('copy');
    // 追加テキストエリアを削除
    bodyElm.removeChild(copyFrom);
    // 処理結果を返却
    return retVal;
}

async function setImageFlg(pid, val = 1) {
    let querySql = "update tbl_patients set havImage=? where patientId=?";
    try {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(dbpath);
            db.run(querySql, val, pid, (err, rows) => {
                if (err == null) {
                    resolve(rows);
                }
                else {
                    reject(err);
                }
            });
            db.close();
        });
    } catch (err_1) {
        alert(err_1.message);
    }
}

function hiddenField(tgt) {
    let eleMain = document.getElementById(tgt);
    let eleSub = document.getElementsByClassName(tgt);

    if (eleMain.classList.contains('onViewEle')) {
        eleMain.classList.remove('onViewEle');
        eleMain.classList.add('offViewEle');
        for(i=0; i <= eleSub.length; i++) {
            eleSub[i].classList.remove('onView');
            eleSub[i].classList.add('offView');
        }
    }
    else {
        eleMain.classList.remove('offViewEle');
        eleMain.classList.add('onViewEle');
        for(i=0; i <= eleSub.length; i++) {
            eleSub[i].classList.remove('offView');
            eleSub[i].classList.add('onView');
        }
    }
}

async function findall(query) {
    try {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(dbpath);
            db.all(query, (err, rows) => {
                if (err == null) {
                    resolve(rows);
                }
                else {
                    reject(err);
                }
            });
            db.close();
        });
    } catch (err_1) {
        alert(err_1.message);
    }
}

function printAllFiles (folderType, pid, ptn = false) {
    pid = ('0000000' + pid).slice(-7);
    let url = getPath(folderType, pid);
    let filenames = fs.readdirSync(url);
    let imgSrc = [];

    filenames.forEach((filename) => {
        // let fullPath = path.join(url, filename);
        let fullPath = url + sep + filename;
        let stats = fs.statSync(fullPath);
        if (stats.isFile()) {
            if(ptn) {
                // if(fullPath.indexOf(ptn) > -1) {
                imgSrc.push(filename);
                // }
            }else {
                imgSrc.push(fullPath);
            }
        } else if (stats.isDirectory()) {
            printAllFiles(folderType, pid, ptn);
        }
    });
    console.log(imgSrc);
    return imgSrc;
}

function resetSearchForm (sec = 'sec2', newFlg = false) {
    let inp = document.getElementsByClassName('inp-data');
    let sel = document.getElementsByClassName('sel-data');
    if (document.getElementById(sec +'-rinsho-list') != null) {
        rinshoList = document.getElementById(sec +'-rinsho-list');
        rinshoList.innerHTML = '';
    }
    if (document.getElementById(sec +'-kakutei-list') != null) {
        kakuteiList = document.getElementById(sec +'-kakutei-list');
        kakuteiList.innerHTML = '';
    }
    if (document.getElementById(sec +'-img-list') != null) {
        imgList = document.getElementById(sec +'-img-list');
        imgList.innerHTML = '';
    }
    if (document.getElementById(sec +'-img-viewer') != null) {
        imgView = document.getElementById('img-viewer');
    }
    if (document.getElementById(sec +'-list-table') != null) {
        listTable = document.getElementById(sec +'-list-table');
    }
    
    if (document.getElementById(sec +'-msg') != null) {
        document.getElementById(sec + '-msg').innerHTML = '';
    }
    document.getElementById(sec +'-img-list').innerHTML = '';
    document.getElementById('img-viewer').innerHTML = '';
    if (document.getElementById(sec +'-tempBtn') != null) {
        document.getElementById(sec +'-tempBtn').remove();
    }
    for (i = 0; i < inp.length; i++) {
        inp[i].value = '';
    }
    for (i = 0; i < sel.length; i++) {
        sel[i].checked = false;
    }

    if(newFlg) {
        onView('addPatient');
        offView('updPatient');
        offView('delPatient');
    }
}

function findFiles(pattern) {
    glob(pattern, function(err, files) {
        if(err) {
            console.log(err);
        }
    });
}

function isNumber(numVal) {
    // チェック条件パターン
    var pattern = /^[-]?([1-9]\d*|0)(\.\d+)?$/;
    // 数値チェック
    return pattern.test(numVal);
}

async function getDbAll(tbl,odr = "id") {
    let query = "select * from "+ tbl +" order by "+ odr;
    try {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(dbpath);
            db.all(query, (err, rows) => {
                if (err == null) {
                    resolve(rows);
                }
                else {
                    reject(err);
                }
            });
            db.close();
        });
    } catch (err_1) {
        alert(err_1.message);
    }
}

async function getDbSelect(tbl,id,tgt = 'id') {
    let query = "select * from ? where " + tgt + "=?";
    try {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(dbpath);
            db.all(query, tbl, id, (err, rows) => {
                if (err == null) {
                    resolve(rows);
                }
                else {
                    console.log(err);
                    reject(err);
                }
            });
            db.close();
        });
    } catch (err_1) {
        alert(err_1.message);
    }
}

function setFiles(pid, sec, pdfpath) {
    let pid0 = ('0000000' + pid).slice(-7);
    if (document.getElementById(sec + '-img-list') != null) {
        imgList = document.getElementById(sec + '-img-list');
        imgList.innerHTML = '';
    }
    if (document.getElementById(sec + '-img-viewer') != null) {
        imgView = document.getElementById(sec + '-img-viewer');
        imgView.innerHTML = '';
    }

    let url = getPath(pdfpath , pid);
    let imgSrc = printAllFiles(pdfpath, pid);
    let viewFile = '';

    if (imgList) {
        if (document.getElementById(sec + '-tempBtn') != null) {
            document.getElementById(sec + '-tempBtn').remove();
        }
        let tagA = document.createElement('button');
        tagA.innerText = '内包フォルダーを開く';
        tagA.setAttribute('id', sec + '-tempBtn');
        tagA.setAttribute('onclick', 'openFolder(\'' + pid + '\',\'' + pdfpath + '\')');
        imgList.before(tagA);
        imgSrc.forEach((filePath) => {
            viewFile += '<object data="' + filePath + '" type="application/pdf" width="50%" height="600"></object>';
        });
        imgList.innerHTML = viewFile;
    }
}

async function selectDiag(tbl, tgt, obj) {
// alert(tgt + obj.value);
    try {
        getDiag(tbl, tgt, obj.value).then((res) => {
            console.log(res);
            if (res) {
                let val = res[0]['id'];
                document.getElementById(obj.id.replace('diagnosis','diagnosisCd')).value = val;
            }
        });
    } catch (error) {
        console.log(error);
    }

}
async function getDiag(tbl, tgt, val) {
    let query = "select * from "+ tbl +" where "+ tgt +"=?";
    try {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(dbpath);
            db.all(query, val, (err, rows) => {
                if (err == null) {
                    resolve(rows);
                }
                else {
                    console.log(err);
                    reject(err);
                }
            });
            db.close();
        });
    } catch (err_1) {
        alert(err_1.message);
    }
}

function onView(tgt) {
    document.getElementById(tgt).style.display = 'block';
}

function offView(tgt) {
    document.getElementById(tgt).style.display = 'none';
}

function typeCheck(path) {
    let flg = false;

    if(path.indexOf(".pdf") > -1) {
        flg = true;
    }

    return flg;
}

function findDbToPid(query,pid) {
    try {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(dbpath);
            db.all(query, pid, (err, rows) => {
                if (err == null) {
                    resolve(rows);
                }
                else {
                    console.log(err);
                    reject(err);
                }
            });
            db.close();
        });
    } catch (err_1) {
        alert(err_1.message);
    }
}

function desableOpration(sec, value, flg = false) {
    document.getElementById(sec + '-wait-bg').style.display = 'block';
    setTimeout(() => {
        if(flg) {
            imgOutputs(value);
        }
        else {
            imgArrOutputs(value);
        }
    }, 800);
}

function desableOprationBgHidden(sec) {
    document.getElementById(sec + '-wait-bg').style.display = 'none';
}

async function imgOutputs(pid, msg=true) {

    let query = "select t1.id,* from tbl_patients as t1 left join tbl_rinsho as t2 on t1.patientId = t2.patientId where t1.patientId=" + pid;
    pid = ('0000000' + pid).slice(-7);
    
    let url;
    let dir_home = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
    let dir_desktop = path.join(dir_home, "Desktop", "ImageBase");
    let mkdate = new Date;
    dir_desktop = dir_desktop + '/' + mkdate.format("Y-m-d") + '/' + pid;
    // alert(filePathLink + pid + url + dir_desktop);
    if (msg) {
        outputCsvFile(query);
    }

    await execOutput(filePathLink, pid, url, dir_desktop);

    if (msg) {
        orgConfirm("sec1", "出力完了！", "desableOprationBgHidden", "sec1");
    }
// externalLink(dir_desktop);
}

function execOutput(filePathLink,pid,url,dir_desktop) {
    // pid = ('0000000' + pid).slice(-7);
    for (let i = 0; i < filePathLink.length; i++) {
        url = filePathLink[i] + pid;
        try {
            fs.copySync(url, dir_desktop);
            // alert(url);
        } catch (error) {
            // alert(error);
        }
    }
}

async function imgArrOutputs(arr) {

    pidArr = splitStringLinefeed(arr);

    var execLoop = () => {
        let query = "select t1.id,* from tbl_patients as t1 left join tbl_rinsho as t2 on t1.patientId = t2.patientId where ";

        for (let i = 0; i <= pidArr.length; i++) {
            if(pidArr[i] != '' && pidArr[i] != undefined) {
                if(i > 0) {
                    query += " or ";
                }
                query += "t1.patientId="+ pidArr[i];
                imgOutputs(pidArr[i],false);
            }
        }
        outputCsvFile(query);
    }

    await execLoop();

    document.getElementById("imgOutputList").value = "";
    orgConfirm("sec9", "出力完了！", "desableOprationBgHidden", "sec9");

}

function outputCsvFile(query) {
    let head = '';
    let rec = '';
    let charset = "utf8";

    try {
        let db = new sqlite3.Database(dbpath);
        // pid = ('0000000' + pid).slice(-7);
        let dir_home = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
        let dir_desktop = path.join(dir_home, "Desktop", "ImageBase");
        let mkdate = new Date;
        dir_desktop = dir_desktop + sep + mkdate.format("Y-m-d") + sep + "抽出_DATA.csv";

        db.all(query, (err, rows) => {

            if (err == null) {
                // console.log(rows);
                rows.forEach(function (row) {
                    head = '';
                    console.log(row);
                    for (const [key, value] of Object.entries(row)) {
                        head += listTitle[key] + ",";
                        rec += ((value == null) ? "":value) + ",";
                    }
                    head += "\n";
                    rec += "\n";
                });
                
                fs.stat(dir_desktop, (error, stats) => {
                    if (error) {
                        // alert(head + rec);
                        fs.writeFile(
                            dir_desktop,
                            '\ufeff' + (head + rec),
                            charset
                        );
                        if (error.code === 'ENOENT') {
                        } else {
                            console.log(error);
                        }
                    } else {
                        fs.appendFile(
                            dir_desktop,
                            '\ufeff' + rec,
                            charset
                        );
                    }
                });
            }
            else {
                console.log(err);
            }
        });
        db.close();
    } catch (err_1) {
        alert(err_1.message);
    }
}

async function externalLink(folderType, pid, fileName) {
    let url = 'file://';
    let path = getPath(folderType, pid, fileName);
    url += path;

    shell.openExternal(url);
}

function getPath(folderType, pid = false, fileName = false) {
    let url;
    switch (folderType) {
        case 'imgpath':
            url = imgpath;
            break;
        case 'pdf1path':
            url = pdf1path;
            break;
        case 'pdf2path':
            url = pdf2path;
            break;
        case 'pdf3path':
            url = pdf3path;
            break;

        default:
            break;
    }
    url += ((pid) ? pid : '') + ((fileName) ? sep + fileName : '');
    return url;
}

async function openFolder(pid, folderType) {
    let url = getPath(folderType, pid);
    shell.showItemInFolder(url);
}

function splitStringLinefeed(string) {
    return string.split(/\r\n|\r|\n/);
}

function onViewForm(sec = "sec3", index = "病理", form = "addByoriForm") {
    let obj = document.getElementById(form);
    if ($("#"+ sec +"-contents").hasClass("offViewForm")) {
        obj.style.display = "none";
        // $("#"+ sec +"-formViewBtn input").attr("value", index +"データ追加");
        // $("#"+ sec +"-contents").addClass("w100p");
        // $("#"+ sec +"-contents").removeClass("w70p");
        $("#"+ sec +"-contents").removeClass("offViewForm");
    }
    else {
        obj.style.display = "block";
        // $("#"+ sec +"-formViewBtn input").attr("value", "フォームを閉じる");
        // $("#"+ sec +"-contents").removeClass("w100p");
        // $("#"+ sec +"-contents").addClass("w70p");
        $("#"+ sec +"-contents").addClass("offViewForm");
    }
    document.getElementById(form.replace('Form', '')).reset();
}

function orgConfirm(sec, msg, func = false, tbl = false, id = false) {
    document.getElementById(sec + '-agree-btn').setAttribute('onclick',  "closeDialog('" + sec + "-confirm')");
    let ele = document.getElementById(sec + '-confirm');
    ele.style.display = 'block';
    document.getElementById(sec + '-confirm-msg').innerHTML = msg;
    // let Sec = sec.charAt(0).toUpperCase() + sec.slice(1).toLowerCase();
    if(func && tbl && id) {
        document.getElementById(sec + '-agree-btn').setAttribute('onclick', func + "('" + tbl + "'," + id + ")");
    }
    else if(func && tbl) {
        document.getElementById(sec + '-agree-btn').setAttribute('onclick', "closeDialog('" + sec + "-confirm');" + func + "('" + tbl + "');");
    }
    else if(func) {
        document.getElementById(sec + '-agree-btn').setAttribute('onclick', func + "()");
    }
}

function closeDialog(ele, ele2 = false, ret = false) {
    document.getElementById(ele).style.display = 'none';
    if(ele2) {
        document.getElementById(ele2).style.display = 'none';
    }
    if(ret) {
        return true;
    }
}

function isNumber(numVal) {
    // チェック条件パターン
    var pattern = /^[-]?([1-9]\d*|0)(\.\d+)?$/;
    // 数値チェック
    return pattern.test(numVal);
}