const { ftruncate } = require("original-fs");
const { searchPatientList } = require("./sec1");
// let fields = ['year','byoriNo','skinNo','biopsyDate','diagnosisCd1','diagnosis1','etcDetail1','part1','diagnosisCd2','diagnosis2','etcDetail2','part2','diagnosisCd3','diagnosis3','etcDetail3','part3'];
let fields = {
    'year': 0,
    'byoriNo': 0,
    'skinNo': 0,
    'biopsyDate': 1,
    'diagnosisCd1': 0,
    'diagnosis1': 1,
    'etcDetail1': 1,
    'part1': 1,
    'diagnosisCd2': 0,
    'diagnosis2': 1,
    'etcDetail2': 1,
    'part2': 1,
    'diagnosisCd3': 0,
    'diagnosis3': 1,
    'etcDetail3': 1,
    'part3': 1
};

exports.searchByori = function (tempPid = false) {
    let query = '';
    let viewFile = '';
    let pid = document.querySelector('#sec3-patientId').value;

    document.getElementById('sec3-msg').innerHTML = '';
    if (document.getElementById('sec3-tempBtn') != null) {
        document.getElementById('sec3-tempBtn').remove();
    }
    if (tempPid) {
        pid = tempPid;
    }
    else if(!pid) {
        let pidArea = document.querySelector('#sec3-patientId');
        pidArea.focus();
        pidArea.value = '';
        document.execCommand("paste");
        if(isNumber(pidArea.value)) {
            pid = pidArea.value;
        }
        else {
            pidArea.value = '';
        }
    }

    try {
        searchOnlyPatient(pid).then((res) => {
            document.querySelector("#sec3-patientId").value = '';
            document.querySelector("#sec3-lastName").innerText = '';
            document.querySelector("#sec3-firstName").innerText = '';
            document.querySelector("#sec3-birthday").innerText = '';
            document.querySelector("#sec3-age").innerText = '';
            document.querySelector("#sec3-monthAge").innerText = '';
            document.querySelector("#sec3-memo").innerText = '';
            document.querySelector("#sec3-sex").innerText = '';
            document.querySelector("#sec3-havImage").innerText = '';
            if(res) {
                let ob = res[0];

                if(ob) {
                    $("#sec3-formViewBtn").removeClass("offView");
                }
                else {
                    $("#sec3-formViewBtn").addClass("offView");
                }
                document.querySelector("#sec3-patientId").value = (ob) ? ob["patientId"] : '';
                document.querySelector("#sec3-lastName").innerText = (ob) ? ob["lastName"] : '';
                document.querySelector("#sec3-firstName").innerText = (ob) ? ob["firstName"] : '';
                document.querySelector("#sec3-birthday").innerText = (ob) ? ob["birthday"] : '';
                document.querySelector("#sec3-age").innerText = (ob) ? ob["age"] : '';
                document.querySelector("#sec3-monthAge").innerText = (ob) ? ob["monthAge"] : '';
                document.querySelector("#sec3-memo").innerText = (ob) ? ob["memo"] : '';
                document.querySelector("#sec3-sex").innerText = (ob) ? ob["sex"] + '性' : '';
                document.querySelector("#sec3-havImage").innerText = (ob) ? 'あり' : '';
            }
        });
    } catch (error) {
        console.log(error);
    }

    var execLoop = () => {

        
        try {
            findPatient(pid, 'byoriShindan').then((res) => {
                if (res) {
                    let viewStr = jsSec3.viewPatientList(res, 'sec3', 'byoriShindan');


                    if(viewStr) {
                        document.getElementById('sec3-byori-list1').innerHTML = '<table class="table table-striped">' +
                            '<thead class="thead-dark">' +
                                '<tr>' +
                                    '<th rowspan="2" class="onAdminCell"></th>' +
                                    '<th rowspan="2">年</th>' +
                                    '<th rowspan="2">病理No</th>' +
                                    '<th rowspan="2" class="w5p">皮No　</th>' +
                                    '<th rowspan="2">採取日</th>' +
                                    '<th colspan="4">病理診断名1</th>' +
                                    '<th colspan="4">病理診断名2</th>' +
                                    '<th colspan="4">病理診断名3</th>' +
                                '</tr>' +
                                '<tr>' +
                                    '<th>コード</th>' +
                                    '<th>病理診断名</th>' +
                                    '<th>その他診断名</th>' +
                                    '<th>部位</th>' +
                                    '<th>コード</th>' +
                                    '<th>病理診断名</th>' +
                                    '<th>その他診断名</th>' +
                                    '<th>部位</th>' +
                                    '<th>コード</th>' +
                                    '<th>病理診断名</th>' +
                                    '<th>その他診断名</th>' +
                                    '<th>部位</th>' +
                                '</tr>' +
                            '</thead>' +
                            '<tbody id="sec3-byori-list1-content">' +
                            '</tbody>' +
                        '</table>';

                        document.getElementById('sec3-byori-list1-content').innerHTML = viewStr;
                        if (loginUserLevel) {
                            $(".onAdmin").css("display", "block");
                            $(".onAdminCell").css("display", "table-cell");
                        }
                    }
                    else {
                        document.getElementById('sec3-byori-list1').innerHTML = "<p class='align-center'>登録データなし</p>";
                    }
                }
            });
        } catch (error) {
            alert("登録データなし");
            console.log(error);
        }
        try {
            findPatient(pid, 'byoriKakutei').then((res) => {
                if (res) {
                    let viewStr = jsSec3.viewPatientList(res, 'sec3', 'byoriKakutei');
                    if(viewStr) {
                        document.getElementById('sec3-byori-list2').innerHTML = '<table class="table table-striped">' +
                            '<thead class="thead-dark">' +
                                '<tr>' +
                                    '<th rowspan="2" class="onAdminCell"></th>' +
                                    '<th rowspan="2">年</th>' +
                                    '<th rowspan="2">病理No</th>' +
                                    '<th rowspan="2" class="w5p">皮No　</th>' +
                                    '<th colspan="4">病理診断名1</th>' +
                                    '<th colspan="4">病理診断名2</th>' +
                                    '<th colspan="4">病理診断名3</th>' +
                                '</tr>' +
                                '<tr>' +
                                    '<th>コード</th>' +
                                    '<th>病理診断名</th>' +
                                    '<th>その他診断名</th>' +
                                    '<th>部位</th>' +
                                    '<th>コード</th>' +
                                    '<th>病理診断名</th>' +
                                    '<th>その他診断名</th>' +
                                    '<th>部位</th>' +
                                    '<th>コード</th>' +
                                    '<th>病理診断名</th>' +
                                    '<th>その他診断名</th>' +
                                    '<th>部位</th>' +
                                '</tr>' +
                            '</thead >' +
                            '<tbody id="sec3-byori-list2-content">' +
                            '</tbody>' +
                        '</table >';
                        document.getElementById('sec3-byori-list2-content').innerHTML = viewStr;
                        if (loginUserLevel) {
                            $(".onAdmin").css("display", "block");
                            $(".onAdminCell").css("display", "table-cell");
                        }
                   }
                    else {
                        document.getElementById('sec3-byori-list2').innerHTML = "<p class='align-center'>登録データなし</p>";
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
        try {
            jsSec3.sec3SetFiles(pid, "sec3", pdf1path);
        } catch (error) {
            
        }
    }

    execLoop();
    // alert("データ出力完了");
    return false;
};

exports.viewPatientList = function (res, sec, tbl) {
    let listView = '';
    let titleWidth = [5, 5, 5, 5, 10, 5, 15, 15, 5, 5, 15, 15, 5, 5, 15, 15, 5];
    let key = 0;
    let table = '';
    let types = [{
        'year': 0,
        'byoriNo': 0,
        'skinNo': 0,
        'biopsyDate': 1,
        'diagnosisCd1': 0,
        'diagnosis1': 1,
        'etcDetail1': 1,
        'part1': 1,
        'diagnosisCd2': 0,
        'diagnosis2': 1,
        'etcDetail2': 1,
        'part2': 1,
        'diagnosisCd3': 0,
        'diagnosis3': 1,
        'etcDetail3': 1,
        'part3': 1
    }];
    let inputType = [{
        'year': 'text',
        'byoriNo': 'text',
        'skinNo': 'text',
        'biopsyDate': 'date',
        'diagnosisCd1': 'text',
        'etcDetail1': 'text',
        'diagnosisCd2': 'text',
        'etcDetail2': 'text',
        'diagnosisCd3': 'text',
        'etcDetail3': 'text'
    }];
    // let cellWid = [{
    //     'year': 'w5p',
    //     'byoriNo': 'w3p',
    //     'skinNo': 'w3p',
    //     'biopsyDate': 'w10p',
    //     'diagnosisCd1': 'w5p',
    //     'etcDetail1': 'w15p',
    //     'diagnosisCd2': 'w5p',
    //     'etcDetail2': 'w15p',
    //     'diagnosisCd3': 'w5p',
    //     'etcDetail3': 'w15p'
    // }];
    let mkdate = new Date;

    for (let ky in res) {
        let ob = res[ky];
        let url = imgpath + ob['patientId'];

        if (ob['patientId']) {
            table += '<tr id="rec-'+ ob['id'] +'">';
            if(loginUserLevel) {
                table += '<td><input type="button" value="削除" onclick="orgConfirm(\'sec3\',\'削除を行います！<br>操作に間違いがなければ「OK」を押してください。\', \'jsSec3.delByoriList\', \'tbl_' + tbl + '\',' + ob['id'] + ');" style="margin-bottom:3px;" class="redBtn"><br>' +
                    '<input type="button" value="更新" onclick="orgConfirm(\'sec3\',\'変更の内容で更新を行います！<br>操作に間違いがなければ「OK」を押してください。\', \'jsSec3.updByoriList\', \'tbl_' + tbl + '\',' + ob['id'] + ');" class="greenBtn"></td>';
            }
            for (let ky2 in types[0]) {
                if(ky2.indexOf('part') != -1) {
                    table += '<td class="w10p">';
                    table += '<select id="' + sec + '-' + ob['id'] + '-' + ky2 + '" class="part w-auto">';
                    let opt = '<option value=""></option>';
                    for (let i = 0; i < partSelArr.length; i++) {
                        opt += '<option value="' + partSelArr[i] + '"' + ((ob[ky2] == partSelArr[i]) ? ' selected="selected"' : '') + '>' + partSelArr[i] + '</option>';
                    }
                    table += opt + '</select></td>';
                }
                else if (ky2 == 'diagnosis1' || ky2 == 'diagnosis2' || ky2 == 'diagnosis3') {
                    table += '<td class="w10p">';
                    table += '<select id="' + sec + '-' + ob['id'] + '-' + ky2 + '" onchange="jsSec3.selectHiDiag(\'pathologyName\',this);" class="w-auto">';
                    let opt = '<option value=""></option>';
                    for (let i = 0; i < hiDiagSelArr.length; i++) {
                        opt += '<option value="' + hiDiagSelArr[i] + '"' + ((ob[ky2] == hiDiagSelArr[i]) ? ' selected="selected"' : '') + '>' + hiDiagSelArr[i] + '</option>';
                    }
                    table += opt + '</select></td>';
                }
                else if(ky2 == 'year') {
                    table += '<td class="w5p">';
                    table += '<select id="' + sec + '-' + ob['id'] + '-' + ky2 + '" class="w-auto">';
                    let opt = '';
                    for (let i = 1960; i <= mkdate.format('Y'); i++) {
                        opt += '<option value="' + i + '"' + ((ob[ky2] == i) ? ' selected="selected"' : '') + '>' + i + '</option>';
                    }
                    table += opt + '</select></td>';
                }
                else if(tbl == 'byoriKakutei' && ky2 == 'biopsyDate') {
                }
                else {
                    // table += '<td class="' + cellWid[0][ky2] + '"><input type="' + inputType[0][ky2] + '" value="' + ((ob[ky2]) ? ob[ky2] : '') + '" id="' + sec + '-' + ob['id'] + '-' + ky2 + '"></td>';
                    table += '<td><input type="' + inputType[0][ky2] + '" value="' + ((ob[ky2]) ? ob[ky2] : '') + '" id="' + sec + '-' + ob['id'] + '-' + ky2 + '"></td>';
                }
            }
            table += '</tr>';
        }
    }

    return table;
}

exports.sec3SetFiles = function(pid, sec, pdfpath) {
    let pid0 = ('0000000' + pid).slice(-7);
    if (document.getElementById(sec + '-img-list') != null) {
        imgList = document.getElementById(sec + '-img-list');
        imgList.innerHTML = '';
    }
    if (document.getElementById(sec + '-img-viewer') != null) {
        imgView = document.getElementById(sec + '-img-viewer');
        imgView.innerHTML = '';
    }
    if (document.getElementById('sec3-tempBtn') != null) {
        document.getElementById('sec3-tempBtn').remove();
    }
    
    let url = pdfpath + pid0;
    let imgSrc = jsSec3.sec3PrintAllFiles(url, pid0);
    let viewFile = '';
    
    if (imgList) {
        if (document.getElementById(sec + '-tempBtn') != null) {
            document.getElementById(sec + '-tempBtn').remove();
        }

        let tagA = document.createElement('button');
        tagA.innerText = '内包フォルダーを開く';
        tagA.setAttribute('id', 'sec3-tempBtn');
        tagA.setAttribute('onclick', 'openFolder(\'' + url + '\')');
        imgList.before(tagA);

        imgSrc.forEach((filePath) => {
            viewFile += '<object data="' + filePath + '" type="application/pdf" width="50%" height="600"></object>';
        });
        imgList.innerHTML = viewFile;
    }
}

exports.sec3PrintAllFiles = function(url, ptn, imgSrc = []) {
    const filenames = fs.readdirSync(url);

    filenames.forEach((filename) => {
        const fullPath = path.join(url, filename);
        // const fullPath = path.join(url, filename);

        const stats = fs.statSync(fullPath);
        // if (stats.isFile()) {
        //     if (filename.indexOf(ptn) > -1) {
        //         if(typeCheck(fullPath)) {
        //             console.log(fullPath);
        //             imgSrc.push(fullPath);
        //         }
        //     }
        // } else if (stats.isDirectory()) {
        //     // console.log(fullPath);
        //     jsSec3.sec3PrintAllFiles(fullPath,ptn,imgSrc);
        // }

        if (stats.isFile()) {
            if (ptn) {
                if (fullPath.indexOf(ptn) > -1) {
                    imgSrc.push(fullPath);
                }
            } else {
                imgSrc.push(fullPath);
            }
        } else if (stats.isDirectory()) {
            jsSec3.sec3PrintAllFiles(fullPath,ptn,imgSrc);
        }
    });
    return imgSrc;
}


exports.selectHiDiag = async function(tgt, obj) {

    try {
        getHiDiag(tgt, obj.value).then((res) => {

            if (res) {
                let val = res[0]['cd'];
                document.getElementById(obj.id.replace('diagnosis', 'diagnosisCd')).value = val;
            }
        });
    } catch (error) {
        console.log(error);
    }

}
async function getHiDiag(tgt, val) {
    let query = "select * from tbl_skinPathAndHiDiag where " + tgt + "=?";
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

exports.delByoriList = async function(tbl, id) {
    document.getElementById('sec3-confirm').style.display = 'none';
    
    query = "delete from "+ tbl +" where id=?";

    let delExec = () => {
        try {
            return new Promise((resolve, reject) => {
                let db = new sqlite3.Database(dbpath);
                db.run(query, id, (err, rows) => {
                    if (err == null) {
                        document.getElementById('rec-'+ id).style.display = "none";
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
    await delExec();

    try {
        jsSec3.searchByori(document.querySelector("#sec3-patientId").value);
    } catch (err_2) {
        console.log(err_2.message);
    }
}

exports.updByoriList = async function(tbl, id) {
    document.getElementById('sec3-confirm').style.display = 'none';
    // let parent = document.getElementById("rec-"+ id);
    let fieldList = [];
    let flg = false;
    let obj;

    query = "update "+ tbl +" set ";
    for(ky in fields) {
        if (obj = document.querySelector("#sec3-" + id + "-" + ky)) {
            if(obj.value) {

                if(flg) {
                    query += ",";
                }
                query += ky +"=";
                
                if (fields[ky]) {
                    query += "'"+ document.querySelector("#sec3-"+ id +"-"+ ky).value +"'";
                }
                else {
                    query += document.querySelector("#sec3-"+ id +"-"+ ky).value;
                }
                
                flg = true;
            }
        }
    }
    query += ",patientId=" + document.querySelector("#sec3-patientId").value;
    query += ",lastName='" + document.getElementById("sec3-lastName").innerText +"'";
    query += " where id="+ id;
// alert(query);

    let updExec = () => {
        try {
            return new Promise((resolve, reject) => {
                let db = new sqlite3.Database(dbpath);
                db.run(query, (err, rows) => {
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
            console.log(err_1.message);
        }
    }
    await updExec();
    document.getElementById("sec3-msg").innerHTML = '<p>更新しました</p>';

    try {
        jsSec3.searchByori(document.querySelector("#sec3-patientId").value);
    } catch (err_2) {
        console.log(err_2.message);
    }
}

exports.addByoriList = async function() {
    // let parent = document.getElementById("rec-"+ id);
    let fieldList = [];
    let flg = false;
    let index = '';
    let value = '';

    let tbl = document.querySelector("#sec3-add-tbl").value;

    query = "insert into "+ tbl +" ";
    for(ky in fields) {
        // alert("#sec3-"+ id +"-"+ ky);
        if (document.querySelector("#sec3-entry-" + ky)) {
            if (document.querySelector("#sec3-entry-" + ky).value) {
                if(flg) {
                    index += ",";
                    value += ",";
                }
                index += ky;
                
                if (fields[ky]) {
                    value += "'"+ document.querySelector("#sec3-entry-"+ ky).value +"'";
                }
                else {
                    value += document.querySelector("#sec3-entry-"+ ky).value;
                }
                
                flg = true;
            }
        }
    }
    index += ",patientId";
    value += "," + document.querySelector("#sec3-patientId").value;
    index += ",lastName";
    value += ",'" + document.getElementById("sec3-lastName").innerText +"'";
    query += "("+ index +") values("+ value +")";
// alert(query);

    let byoriAddExec = () => {
        try {
            return new Promise((resolve, reject) => {
                let db = new sqlite3.Database(dbpath);
                db.run(query, (err, rows) => {
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
            console.log(err_1.message);
        }
    }

    await byoriAddExec();

    jsSec3.searchByori(document.querySelector("#sec3-patientId").value);
}

exports.selKakuteiCheck = function() {
    let selData = document.querySelector("#sec3-add-tbl").value;
    let wrap = document.querySelector("#sec3-entry-biopsyDate-wrap");
    if(selData == 'tbl_byoriKakutei') {
        wrap.style.display = "none";
    }
    else {
        wrap.style.display = "flex";
    }
}