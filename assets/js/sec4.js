let itemArr = [
    ['id',1],
    ['opDate', 1],
    ['opProcedureCd1', 1],
    ['opProcedure1', 1],
    ['etc1', 1],
    ['opProcedureCd2', 1],
    ['opProcedure2', 1],
    ['etc2', 1],
    ['opProcedureCd3', 1],
    ['opProcedure3', 1],
    ['etc3', 1],
    ['opProcedureCd4', 1],
    ['opProcedure4', 1],
    ['etc4', 1],
    ['surgeon', 0],
    ['surgicalAssistant', 0],
    ['anesthesia1', 0],
    ['anesthesia2', 0],
    ['anesthetics', 0],
    ['position', 0],
    ['opTime', 0],
    ['bleedingVolume', 0],
    ['comment', 0]
];

let fields = {
    'opDate': 1,
    'opProcedureCd1': 0,
    'opProcedure1': 1,
    'etc1': 1,
    'opProcedureCd2': 0,
    'opProcedure2': 1,
    'etc2': 1,
    'opProcedureCd3': 0,
    'opProcedure3': 1,
    'etc3': 1,
    'opProcedureCd4': 0,
    'opProcedure4': 1,
    'etc4': 1,
    'surgeon': 1,
    'surgicalAssistant': 1,
    'anesthesia1': 1,
    'anesthesia2': 1,
    'anesthetics': 1,
    'position': 1,
    'opTime': 1,
    'bleedingVolume': 1,
    'comment': 1
};

let targetTable = 'surgicalOperation';

exports.searchOpe = function (tempPid = false) {
    let pid = document.querySelector('#sec4-patientId').value;

    document.getElementById('sec4-msg').innerHTML = '';
    if (document.getElementById('sec4-ope-list2') != null) {
        document.getElementById('sec4-ope-list2').innerHTML = '';
    }
    if (document.getElementById('sec4-ope-detail') != null) {
        document.getElementById('sec4-ope-detail').innerHTML = '';
    }
    if (document.getElementById('sec4-tempBtn') != null) {
        document.getElementById('sec4-tempBtn').remove();
    }
    if (tempPid) {
        pid = tempPid;
    }
    else if (!pid) {
        let pidArea = document.querySelector('#sec4-patientId');
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
            document.querySelector("#sec4-patientId").value = '';
            document.querySelector("#sec4-lastName").innerText = '';
            document.querySelector("#sec4-firstName").innerText = '';
            document.querySelector("#sec4-birthday").innerText = '';
            document.querySelector("#sec4-age").innerText = '';
            document.querySelector("#sec4-monthAge").innerText = '';
            document.querySelector("#sec4-memo").innerText = '';
            document.querySelector("#sec4-sex").innerText = '';
            document.querySelector("#sec4-havImage").innerText = '';
            if (res) {
                let ob = res[0];

                if (ob) {
                    $("#sec4-formViewBtn").removeClass("offView");
                }
                else {
                    $("#sec4-formViewBtn").addClass("offView");
                }
                
                document.querySelector("#sec4-patientId").value = (ob["patientId"]) ? ob["patientId"] : '';
                document.querySelector("#sec4-lastName").innerText = (ob["lastName"]) ? ob["lastName"] : '';
                document.querySelector("#sec4-firstName").innerText = (ob["firstName"]) ? ob["firstName"] : '';
                document.querySelector("#sec4-birthday").innerText = (ob["birthday"]) ? ob["birthday"] : '';
                document.querySelector("#sec4-age").innerText = (ob["age"]) ? ob["age"] : '';
                document.querySelector("#sec4-monthAge").innerText = (ob["monthAge"]) ? ob["monthAge"] : '';
                document.querySelector("#sec4-memo").innerText = (ob["memo"]) ? ob["memo"] : '';
                document.querySelector("#sec4-sex").innerText = (ob["sex"]) ? ob["sex"] + '性' : '';
                document.querySelector("#sec4-havImage").innerText = (ob["havImage"]) ? 'あり' : '';
            }
        });
    } catch (error) {
        console.log(error);
    }

    try {
        findPatient(pid, targetTable).then((res) => {
            if (res) {
                let viewStr = jsSec4.viewPatientList(res, targetTable);
                if(viewStr) {
                    document.getElementById('sec4-ope-list1').innerHTML = viewStr;
                }
                else {
                    document.getElementById('sec4-ope-list1').innerHTML = "<tr><td colspan='15' class='align-center'>登録データなし</td></tr>";
                }
                setFiles(pid, "sec4", "pdf2path");
            }
        });
    } catch (error) {
        alert("登録データなし");
        console.log(error);
    }

    return false;
};

exports.viewPatientList = function (res, sec) {
    let no = 1;
    let table = '';

    for (let ky in res) {
        let ob = res[ky];
        let pid = ob['patientId'];

        if(pid) {   
            table += '<tr onclick="jsSec4.detailSurgicalOpe('+ ob['id'] +','+ pid +')">';
            for (let ky2 in itemArr) {
                if(itemArr[ky2][1]) {
                    table += '<td>' + ((ob[itemArr[ky2][0]]) ? ob[itemArr[ky2][0]] : '') + '</td>';
                }
            }
            table += '</tr>';
            no++;
        }
    }

    return table;
}

exports.detailSurgicalOpe = function(id, pid) {

    let no = 1;
    let table = '';
    let opDetail = '';
    let tempRec = '';

    let viewPosi = {
        'id': 1,
        'opDate': 1,
        'opProcedureCd1': 1,
        'opProcedure1': 1,
        'etc1': 1,
        'opProcedureCd2': 1,
        'opProcedure2': 1,
        'etc2': 1,
        'opProcedureCd3': 1,
        'opProcedure3': 1,
        'etc3': 1,
        'opProcedureCd4': 1,
        'opProcedure4': 1,
        'etc4': 1,
        'surgeon': 0,
        'surgicalAssistant': 0,
        'anesthesia1': 0,
        'anesthesia2': 0,
        'anesthetics': 0,
        'position': 0,
        'opTime': 0,
        'bleedingVolume': 0,
        'comment': 0
    };
    let inputType = [{
        'opDate': 'date',
        'opProcedureCd1': 'text',
        'etc1': 'text',
        'opProcedureCd2': 'text',
        'etc2': 'text',
        'opProcedureCd3': 'text',
        'etc3': 'text',
        'opProcedureCd4': 'text',
        'etc4': 'text',
        'surgeon': 'text',
        'surgicalAssistant': 'text',
        'anesthesia1': 'text',
        'anesthesia2': 'text',
        'anesthetics': 'text',
        'position': 'text',
        'opTime': 'text',
        'bleedingVolume': 'text',
        'comment': 'text'
    }];

    try {
        findPatient(pid, targetTable).then((res) => {
            if (res) {
                let tblHead = '<table class="table table-striped">' +
                    '<thead class="thead-dark" >' +
                        '<tr>' +
                            '<th rowspan="2" class="onAdminCell"></th>' +
                            '<th rowspan="2">id</th>' +
                            '<th rowspan="2">手術年月日</th>' +
                            '<th colspan="3">術式1</th>' +
                            '<th colspan="3">術式2</th>' +
                            '<th colspan="3">術式3</th>' +
                            '<th colspan="3">術式4</th>' +
                        '</tr>' +
                        '<tr>' +
                            '<th>コード</th>' +
                            '<th>術式</th>' +
                            '<th>その他</th>' +
                            '<th>コード</th>' +
                            '<th>術式</th>' +
                            '<th>その他</th>' +
                            '<th>コード</th>' +
                            '<th>術式</th>' +
                            '<th>その他</th>' +
                            '<th>コード</th>' +
                            '<th>術式</th>' +
                            '<th>その他</th>' +
                        '</tr>' +
                    '</thead >' +
                    '<tbody id="sec4-ope-list2-content">' +
                    '</tbody>' +
                '</table>';
                let tblDetailHead = '<table class="table table-striped not-hover">' +
                    '<thead class="thead-dark">' +
                        '<tr>' +
                            '<th rowspan="2">術者名</th>' +
                            '<th rowspan="2">助手名</th>' +
                            '<th rowspan="2">麻酔区分1</th>' +
                            '<th rowspan="2">麻酔区分2</th>' +
                            '<th rowspan="2">麻酔薬剤</th>' +
                            '<th rowspan="2">体位</th>' +
                            '<th rowspan="2">手術時間</th>' +
                            '<th rowspan="2">出血量</th>' +
                            '<th rowspan="2">コメント</th>' +
                        '</tr>' +
                    '</thead >' +
                    '<tbody id="sec4-ope-detail-content">' +
                    '</tbody>' +
                '</table>';
                for (let ky in res) {
                    let ob = res[ky];

                    if (ob['id'] == id) {
                        table += '<tr id="rec-' + ob['id'] + '">';
                        if (loginUserLevel) {
                            table += '<td><input type="button" value="削除" onclick="orgConfirm(\'sec4\',\'削除を行います！<br>操作に間違いがなければ「OK」を押してください。\', \'jsSec4.delOpeList\', \'tbl_surgicalOperation\',' + ob['id'] + ');" style="margin-bottom:3px;" class="redBtn"><br>' +
                                '<input type="button" value="更新" onclick="orgConfirm(\'sec4\',\'変更の内容で更新を行います！<br>操作に間違いがなければ「OK」を押してください。\', \'jsSec4.updOpeList\', \'tbl_surgicalOperation\',' + ob['id'] + ');" class="greenBtn"></td>';
                        }
                        opDetail += '<tr>';
                        for (let ky2 in viewPosi) {
                            if (ky2 == 'opProcedure1' || ky2 == 'opProcedure2' || ky2 == 'opProcedure3' || ky2 == 'opProcedure4') {
                                tempRec += '<td class="w10p">';
                                tempRec += '<select id="sec4-' + ob['id'] + '-' + ky2 + '" onchange="jsSec4.selectOpProcedure(\'opProcedure\',this);" required>';
                                let opt = '<option value=""></option>';
                                for (let i = 0; i < opProcedureSelArr.length; i++) {
                                    opt += '<option value="' + opProcedureSelArr[i] + '"' + ((ob[ky2] == opProcedureSelArr[i]) ? ' selected="selected"' : '') + '>' + opProcedureSelArr[i] + '</option>';
                                }
                                tempRec += opt + '</select></td>';
                            }
                            else if(ky2 == 'id') {
                                tempRec += '<td>' + ((ob[ky2]) ? ob[ky2] : '') + '</td>';
                            }
                            else {
                                tempRec += '<td><input type="' + inputType[ky2] + '" value="' + ((ob[ky2]) ? ob[ky2] : '') + '" id="sec4-' + ob['id'] + '-' + ky2 + '"></td>';
                            }

                            // if (itemArr[ky2][1]) {
                            //     table += '<td>' + ((ob[itemArr[ky2][0]]) ? ob[itemArr[ky2][0]] : '') + '</td>';
                            // }
                            // else {
                            //     opDetail += '<td>' + ((ob[itemArr[ky2][0]]) ? ob[itemArr[ky2][0]] : '') + '</td>';
                            // }
                            if (viewPosi[ky2]) {
                                table += tempRec;
                            }
                            else {
                                opDetail += tempRec;
                            }
                            tempRec = '';
                        }
                        table += '</tr>';
                        opDetail += '</tr>';
                    }
                    no++;
                }
                document.getElementById('sec4-ope-list2').innerHTML = tblHead;
                document.getElementById('sec4-ope-list2-content').innerHTML = table;
                document.getElementById('sec4-ope-detail').innerHTML = tblDetailHead;
                document.getElementById('sec4-ope-detail-content').innerHTML = opDetail;
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

exports.mkOpOpt = function() {
    let opt = '<option value=""></option>';
    for (let i = 0; i < opProcedureSelArr.length; i++) {
        opt += '<option value="' + opProcedureSelArr[i] + '">' + opProcedureSelArr[i] + '</option>';
    }
    $("select[id^='sec4-entry-opProcedure']").html(opt);
}

exports.selectOpProcedure = async function (tgt, obj) {

    try {
        getOpProcedure(tgt, obj.value).then((res) => {

            if (res) {
                let val = res[0]['cd'];
                document.getElementById(obj.id.replace('opProcedure', 'opProcedureCd')).value = val;
            }
        });
    } catch (error) {
        console.log(error);
    }

}
async function getOpProcedure(tgt, val) {
    let query = "select * from tbl_opProcedure where " + tgt + "=?";
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

exports.addOpeList = async function () {
    // let parent = document.getElementById("rec-"+ id);
    let fieldList = [];
    let flg = false;
    let index = '';
    let value = '';

    query = "insert into tbl_surgicalOperation ";
    for (ky in fields) {
        // alert("#sec4-"+ id +"-"+ ky);
        if (document.querySelector("#sec4-entry-" + ky)) {
            if (document.querySelector("#sec4-entry-" + ky).value) {
                if (flg) {
                    index += ",";
                    value += ",";
                }
                index += ky;

                if (fields[ky]) {
                    value += "'" + document.querySelector("#sec4-entry-" + ky).value + "'";
                }
                else {
                    value += document.querySelector("#sec4-entry-" + ky).value;
                }

                flg = true;
            }
        }
    }
    index += ",patientId";
    value += "," + document.querySelector("#sec4-patientId").value;
    index += ",lastName";
    value += ",'" + document.getElementById("sec4-lastName").innerText + "'";
    query += "(" + index + ") values(" + value + ")";
    // alert(query);

    let opeAddExec = () => {
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

    await opeAddExec();

    jsSec4.searchOpe(document.querySelector("#sec4-patientId").value);
}

exports.delOpeList = async function (tbl, id) {
    document.getElementById('sec4-confirm').style.display = 'none';
    
    query = "delete from " + tbl + " where id=?";

    let opeDelExec = () => {
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

    await opeDelExec();

    try {
        jsSec4.searchOpe(document.querySelector("#sec4-patientId").value);
    } catch (err_2) {
        console.log(err_2.message);
    }
}

exports.updOpeList = async function (tbl, id) {
    document.getElementById('sec4-confirm').style.display = 'none';
    // let parent = document.getElementById("rec-"+ id);
    let fieldList = [];
    let flg = false;

    query = "update " + tbl + " set ";
    for (ky in fields) {

        if (document.querySelector("#sec4-" + id + "-" + ky).value) {
            if (flg) {
                query += ",";
            }
            query += ky + "=";

            if (fields[ky]) {
                query += "'" + document.querySelector("#sec4-" + id + "-" + ky).value + "'";
            }
            else {
                query += document.querySelector("#sec4-" + id + "-" + ky).value;
            }

            flg = true;
        }
    }
    query += ",patientId=" + document.querySelector("#sec4-patientId").value;
    query += ",lastName='" + document.getElementById("sec4-lastName").innerText + "'";
    query += " where id=" + id;

    let opeUpdExec = () => {
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
    await opeUpdExec();
    document.getElementById("sec4-msg").innerHTML = '<p>更新しました</p>';
    
    try {
        jsSec4.searchOpe(document.querySelector("#sec4-patientId").value);
    } catch (err_2) {
        console.log(err_2.message);
    }
}

