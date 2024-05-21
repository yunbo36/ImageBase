let itemArr = [
    ['dateOfHospitalization', 1, 1],
    ['dischargeDate', 1, 1],
    ['transferDate', 1, 1],
    ['dateOfDeath', 1, 1],
    ['cd1', 1, 1],
    ['diseaseName1', 1, 1],
    ['etc1', 1, 1],
    ['part1', 1, 1],
    ['cd2', 0, 1],
    ['diseaseName2', 0, 1],
    ['etc2', 0, 1],
    ['part2', 0, 1],
    ['cd3', 0, 1],
    ['diseaseName3', 0, 1],
    ['etc3', 0, 1],
    ['part3', 0, 1],
    ['cd4', 0, 1],
    ['diseaseName4', 0, 1],
    ['etc4', 0, 1],
    ['part4', 0, 1],
    ['cd5', 0, 1],
    ['diseaseName5', 0, 1],
    ['etc5', 0, 1],
    ['part5', 0, 1]
];

let fields = {
    'dateOfHospitalization': 1,
    'dischargeDate': 1,
    'transferDate': 1,
    'dateOfDeath': 1,
    'cd1': 1,
    'diseaseName1': 1,
    'etc1': 1,
    'part1': 1,
    'cd2': 0,
    'diseaseName2': 1,
    'etc2': 1,
    'part2': 1,
    'cd3': 0,
    'diseaseName3': 1,
    'etc3': 1,
    'part3': 1,
    'cd4': 0,
    'diseaseName4': 1,
    'etc4': 1,
    'part4': 1,
    'cd5': 0,
    'diseaseName5': 1,
    'etc5': 1,
    'part5': 1
}

let targetTable = 'medicalHistory';

exports.searchMedicalHistory = function (tempPid = false) {
    let pid = document.querySelector('#sec5-patientId').value;

    document.getElementById('sec5-msg').innerHTML = '';
    if (document.getElementById('sec5-medical-history-list2') != null) {
        document.getElementById('sec5-medical-history-list2').innerHTML = '';
    }
    if (document.getElementById('sec5-medical-history-detail1') != null) {
        document.getElementById('sec5-medical-history-detail1').innerHTML = '';
    }
    if (document.getElementById('sec5-medical-history-detail2') != null) {
        document.getElementById('sec5-medical-history-detail2').innerHTML = '';
    }
    if (document.getElementById('sec5-tempBtn') != null) {
        document.getElementById('sec5-tempBtn').remove();
    }
    if (tempPid) {
        pid = tempPid;
    }
    else if (!pid) {
        let pidArea = document.querySelector('#sec5-patientId');
        pidArea.focus();
        pidArea.value = '';
        document.execCommand("paste");
        if (isNumber(pidArea.value)) {
            pid = pidArea.value;
        }
        else {
            pidArea.value = '';
        }
    }

    try {
        searchOnlyPatient(pid).then((res) => {
            document.querySelector("#sec5-patientId").value = '';
            document.querySelector("#sec5-lastName").innerText = '';
            document.querySelector("#sec5-firstName").innerText = '';
            document.querySelector("#sec5-birthday").innerText = '';
            document.querySelector("#sec5-age").innerText = '';
            document.querySelector("#sec5-monthAge").innerText = '';
            document.querySelector("#sec5-memo").innerText = '';
            document.querySelector("#sec5-sex").innerText = '';
            document.querySelector("#sec5-havImage").innerText = '';
            if (res) {
                let ob = res[0];
                if (ob) {
                    $("#sec5-formViewBtn").removeClass("offView");
                }
                else {
                    $("#sec5-formViewBtn").addClass("offView");
                }
                document.querySelector("#sec5-patientId").value = (ob["patientId"]) ? ob["patientId"] : '';
                document.querySelector("#sec5-lastName").innerText = (ob["lastName"]) ? ob["lastName"] : '';
                document.querySelector("#sec5-firstName").innerText = (ob["firstName"]) ? ob["firstName"] : '';
                document.querySelector("#sec5-birthday").innerText = (ob["birthday"]) ? ob["birthday"] : '';
                document.querySelector("#sec5-age").innerText = (ob["age"]) ? ob["age"] : '';
                document.querySelector("#sec5-monthAge").innerText = (ob["monthAge"]) ? ob["monthAge"] : '';
                document.querySelector("#sec5-memo").innerText = (ob["memo"]) ? ob["memo"] : '';
                document.querySelector("#sec5-sex").innerText = (ob["sex"]) ? ob["sex"] + '性' : '';
                document.querySelector("#sec5-havImage").innerText = (ob["havImage"]) ? 'あり' : '';
            }
        });
    } catch (error) {
        console.log(error);
    }

    try {
        findPatient(pid, targetTable, 't2.dateOfHospitalization asc,t1.id asc').then((res) => {

            if (res) {
                let viewStr = jsSec5.viewPatientList(res, targetTable);

                if(viewStr) {
                    document.getElementById('sec5-medical-history-list1').innerHTML = viewStr;
                }
                else {
                    document.getElementById('sec5-medical-history-list1').innerHTML = "<tr><td colspan='8' class='align-center'>登録データなし</td></tr>";
                }
                setFiles(pid, "sec5", "pdf3path");
            }
        });
    } catch (error) {
        alert("登録データなし");
        console.log(error);
    }
    return false;
};

exports.mkDiseaseNameOpt = function () {
    let opt = '<option value=""></option>';
    for (let i = 0; i < diseaseNameSelArr.length; i++) {
        opt += '<option value="' + diseaseNameSelArr[i] + '">' + diseaseNameSelArr[i] + '</option>';
    }
    $("select[id^='sec5-entry-diseaseName']").html(opt);
    jsSec5.mkPartOpt();
}

exports.mkPartOpt = function () {
    let opt = '<option value=""></option>';
    for (let i = 0; i < partSelArr.length; i++) {
        opt += '<option value="' + partSelArr[i] + '">' + partSelArr[i] + '</option>';
    }
    $("select[id^='sec5-entry-part']").html(opt);
}

exports.selectDiseaseName = async function (tgt, obj) {

    try {
        getDiseaseName(tgt, tgt, obj.value).then((res) => {
            if (res) {

                let val = res[0]['CD'];
                document.getElementById(obj.id.replace('diseaseName', 'cd')).value = val;
            }
        });
    } catch (error) {
        console.log(error);
    }

}

async function getDiseaseName(tbl = "diseaseName", tgt, val) {
    let query = "select * from tbl_" + tbl + " where " + tgt + "=?";

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

exports.viewPatientList = function (res, sec) {
    let no = 1;
    let table = '';

    for (let ky in res) {
        let ob = res[ky];
        let pid = ob['patientId'];
        let tempVal = '';
        if(pid) {
            table += '<tr onclick="jsSec5.detailMedicalHistory(' + ob['id'] + ',' + pid + ')">';
            for (let ky2 in itemArr) {                
                if (itemArr[ky2][1]) {
                    // tempVal = (ob[itemArr[ky2][0]] == null) ? '': ob[itemArr[ky2][0]];
                    // table += '<td><input type="text" value="' + tempVal + '" name="' + itemArr[ky2][0] + '" id="' + itemArr[ky2][0] +'"></td>';
                    table += '<td>' + ((ob[itemArr[ky2][0]]) ? ob[itemArr[ky2][0]] : '') + '</td>';
                }
            }
            no++;
        }
    }
    
    return table;
}
    
exports.detailMedicalHistory = function (id, pid) {
    
    let no = 1;
    let table = '';
    let opDetail1 = '';
    let opDetail2 = '';
    let tempRec = '';
    
    let inputType = {
        'dateOfHospitalization': 'date',
        'dischargeDate': 'date',
        'transferDate': 'date',
        'dateOfDeath': 'date',
        'cd1': 'text',
        'diseaseName1': 'text',
        'etc1': 'text',
        'part1': 'text',
        'cd2': 'text',
        'diseaseName2': 'text',
        'etc2': 'text',
        'part2': 'text',
        'cd3': 'text',
        'diseaseName3': 'text',
        'etc3': 'text',
        'part3': 'text',
        'cd4': 'text',
        'diseaseName4': 'text',
        'etc4': 'text',
        'part4': 'text',
        'cd5': 'text',
        'diseaseName5': 'text',
        'etc5': 'text',
        'part5': 'text'
    }

    let viewPosi = {
        'dateOfHospitalization': 0,
        'dischargeDate': 0,
        'transferDate': 0,
        'dateOfDeath': 0,
        'cd1': 0,
        'diseaseName1': 0,
        'etc1': 0,
        'part1': 0,
        'cd2': 1,
        'diseaseName2': 1,
        'etc2': 1,
        'part2': 1,
        'cd3': 1,
        'diseaseName3': 1,
        'etc3': 1,
        'part3': 1,
        'cd4': 2,
        'diseaseName4': 2,
        'etc4': 2,
        'part4': 2,
        'cd5': 2,
        'diseaseName5': 2,
        'etc5': 2,
        'part5': 2
    };

    let cellWid = {
        'dateOfHospitalization': 'w10p',
        'dischargeDate': 'w10p',
        'transferDate': 'w10p',
        'dateOfDeath': 'w10p',
        'cd1': 'w5p',
        'cd2': 'w5p',
        'cd3': 'w5p',
        'cd4': 'w5p',
        'cd5': 'w5p',
    };
    
    try {
        findPatient(pid, targetTable, 't2.dateOfHospitalization asc,t1.id asc').then((res) => {
            if (res) {
                let tblHead = '<table class="table table-striped">' +
                    '<thead class="thead-dark">' +
                        '<tr>' +
                            '<th rowspan="2" class="onAdminCell"></th>' +
                            '<th rowspan="2">入院年月日</th>' +
                            '<th rowspan="2">退院年月日</th>' +
                            '<th rowspan="2">転科年月日</th>' +
                            '<th rowspan="2">死亡年月日</th>' +
                            '<th colspan="4">疾患名1</th>' +
                        '</tr>' +
                        '<tr>' +
                            '<th>コード</th>' +
                            '<th>疾患名</th>' +
                            '<th>その他</th>' +
                            '<th>部位</th>' +
                        '</tr>' +
                    '</thead >' +
                    '<tbody id="sec5-medical-history-list2">' +
                    '</tbody>' +
                '</table >' +
                '<table class="table table-striped">' +
                    '<thead class="thead-dark">' +
                        '<tr>' +
                            '<th colspan="4">疾患名2</th>' +
                            '<th colspan="4">疾患名3</th>' +
                        '</tr>' +
                        '<tr>' +
                            '<th>コード</th>' +
                            '<th>疾患名</th>' +
                            '<th>その他</th>' +
                            '<th>部位</th>' +
                            '<th>コード</th>' +
                            '<th>疾患名</th>' +
                            '<th>その他</th>' +
                            '<th>部位</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody id="sec5-medical-history-detail1">' +
                    '</tbody>' +
                '</table>' +
                '<table class="table table-striped">' +
                    '<thead class="thead-dark">' +
                        '<tr>' +
                            '<th colspan="4">疾患名4</th>' +
                            '<th colspan="4">疾患名5</th>' +
                        '</tr>' +
                        '<tr>' +
                            '<th>コード</th>' +
                            '<th>疾患名</th>' +
                            '<th>その他</th>' +
                            '<th>部位</th>' +
                            '<th>コード</th>' +
                            '<th>疾患名</th>' +
                            '<th>その他</th>' +
                            '<th>部位</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody id="sec5-medical-history-detail2">' +
                    '</tbody>' +
                '</table>';
                for (let ky in res) {
                    let ob = res[ky];
                    
                    if (ob['id'] == id) {
                        table += '<tr id="rec-' + ob['id'] + '">';
                        if (loginUserLevel) {
                            table += '<td><input type="button" value="削除" onclick="orgConfirm(\'sec5\',\'削除を行います！<br>操作に間違いがなければ「OK」を押してください。\', \'jsSec5.delMedicalHistoryList\', \'tbl_medicalHistory\',' + ob['id'] + ');" style="margin-bottom:3px;" class="redBtn"><br>' +
                                '<input type="button" value="更新" onclick="orgConfirm(\'sec5\',\'変更の内容で更新を行います！<br>操作に間違いがなければ「OK」を押してください。\', \'jsSec5.updMedicalHistoryList\', \'tbl_medicalHistory\',' + ob['id'] + ');" class="greenBtn"></td>';
                        }
                        opDetail1 += '<tr>';
                        opDetail2 += '<tr>';
                        for (let ky2 in inputType) {
                            if (ky2.indexOf('part') != -1) {
                                tempRec += '<td class="w10p">';
                                tempRec += '<select id="sec5-' + ob['id'] + '-' + ky2 + '" class="part">';
                                let opt = '<option value=""></option>';
                                for (let i = 0; i < partSelArr.length; i++) {
                                    opt += '<option value="' + partSelArr[i] + '"' + ((ob[ky2] == partSelArr[i]) ? ' selected="selected"' : '') + '>' + partSelArr[i] + '</option>';
                                }
                                tempRec += opt + '</select></td>';
                            }
                            else if (ky2.indexOf('diseaseName') != -1) {
                                tempRec += '<td class="w10p">';
                                tempRec += '<select id="sec5-' + ob['id'] + '-' + ky2 + '" onchange="jsSec5.selectDiseaseName(\'diseaseName\',this);" required>';
                                let opt = '<option value=""></option>';
                                for (let i = 0; i < diseaseNameSelArr.length; i++) {
                                    opt += '<option value="' + diseaseNameSelArr[i] + '"' + ((ob[ky2] == diseaseNameSelArr[i]) ? ' selected="selected"' : '') + '>' + diseaseNameSelArr[i] + '</option>';
                                }
                                tempRec += opt + '</select></td>';
                            }
                            else {
                                tempRec += '<td class="' + cellWid[ky2] + '"><input type="' + inputType[ky2] + '" value="' + ((ob[ky2]) ? ob[ky2] : '') + '" id="sec5-' + ob['id'] + '-' + ky2 + '"></td>';
                            }
                            // if (itemArr[ky2][2]) {
                            //     // table += '<td>' + ((ob[itemArr[ky2][0]]) ? ob[itemArr[ky2][0]] : '') + '</td>';
                            //     tempVal = (ob[itemArr[ky2][0]] == null) ? '': ob[itemArr[ky2][0]];
                            //     table += '<td><input type="text" value="' + tempVal + '" name="' + itemArr[ky2][0] + '" id="' + itemArr[ky2][0] +'"></td>';
                            // }
                            // else {
                            //     opDetail += '<td>' + ((ob[itemArr[ky2][0]]) ? ob[itemArr[ky2][0]] : '') + '</td>';
                            // }
                            if (viewPosi[ky2] == 0) {
                                table += tempRec;
                            }
                            else if(viewPosi[ky2] == 1){
                                opDetail1 += tempRec;
                            }
                            else {
                                opDetail2 += tempRec;
                            }
                            tempRec = '';
                        }
                        table += '</tr>';
                        opDetail1 += '</tr>';
                        opDetail2 += '</tr>';
                    }
                    no++;
                }
                document.getElementById('sec5-medical-history-selected').innerHTML = tblHead;
                document.getElementById('sec5-medical-history-list2').innerHTML = table;
                document.getElementById('sec5-medical-history-detail1').innerHTML = opDetail1;
                document.getElementById('sec5-medical-history-detail2').innerHTML = opDetail2;
                if (loginUserLevel) {
                    $(".onAdmin").css("display", "block");
                    $(".onAdminCell").css("display", "table-cell");
                }
            }
        });
    } catch (error) {
        alert("登録データなし");
        console.log(error);
    }
}


exports.addMedicalHistoryList = async function () {
    // let parent = document.getElementById("rec-"+ id);
    let fieldList = [];
    let flg = false;
    let index = '';
    let value = '';

    query = "insert into tbl_medicalHistory ";
    for (ky in fields) {
        if (document.querySelector("#sec5-entry-" + ky)) {
            if (document.querySelector("#sec5-entry-" + ky).value) {
                if (flg) {
                    index += ",";
                    value += ",";
                }
                index += ky;

                if (fields[ky]) {
                    value += "'" + document.querySelector("#sec5-entry-" + ky).value + "'";
                }
                else {
                    value += document.querySelector("#sec5-entry-" + ky).value;
                }

                flg = true;
            }
        }
    }
    index += ",patientId";
    value += "," + document.querySelector("#sec5-patientId").value;
    index += ",lastName";
    value += ",'" + document.getElementById("sec5-lastName").innerText + "'";
    query += "(" + index + ") values(" + value + ")";

    let medicalHistoryAddExec = () => {
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

    await medicalHistoryAddExec();

    jsSec5.searchMedicalHistory(document.querySelector("#sec5-patientId").value);
}

exports.delMedicalHistoryList = async function (tbl, id) {
    document.getElementById('sec5-confirm').style.display = 'none';

    query = "delete from " + tbl + " where id=?";

    let medicalHistoryDelExec = () => {

        try {
            return new Promise((resolve, reject) => {
                let db = new sqlite3.Database(dbpath);
                db.run(query, id, (err, rows) => {
                    if (err == null) {
                        document.getElementById('rec-' + id).style.display = "none";
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

    await medicalHistoryDelExec();

    try {
        jsSec5.searchMedicalHistory(document.querySelector("#sec5-patientId").value);
    } catch (err_2) {
        console.log(err_2.message);
    }
}

exports.updMedicalHistoryList = async function (tbl, id) {
    document.getElementById('sec5-confirm').style.display = 'none';
    // let parent = document.getElementById("rec-"+ id);
    let fieldList = [];
    let flg = false;

    query = "update " + tbl + " set ";
    for (ky in fields) {
        
        if (document.querySelector("#sec5-" + id + "-" + ky).value) {
            if (flg) {
                query += ",";
            }
            query += ky + "=";
            
            if (fields[ky]) {
                query += "'" + document.querySelector("#sec5-" + id + "-" + ky).value + "'";
            }
            else {
                query += document.querySelector("#sec5-" + id + "-" + ky).value;
            }

            flg = true;
        }
    }
    query += ",patientId=" + document.querySelector("#sec5-patientId").value;
    query += ",lastName='" + document.getElementById("sec5-lastName").innerText + "'";
    query += " where id=" + id;

    let medicalHistoryUpdExec = () => {
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
    await medicalHistoryUpdExec();
    document.getElementById('sec5-msg').innerHTML = '<p>更新しました</p>';

    try {
        jsSec5.searchMedicalHistory(document.querySelector("#sec5-patientId").value);
    } catch (err_2) {
        console.log(err_2.message);
    }

}

