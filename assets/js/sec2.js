let titleList = [['選択', 5], ['コード', 10], ['分類', 15], ['診断名', 25], ['判定', 5], ['部位', 10], ['部位コメント', 25], ['', 5]];
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
let entryIndex = [
    'diagnosisCd',
    'diagnosis',
    'etcDetail',
    'judgment',
    'part',
    'partCategory'
];

let flg = 0;

exports.printCheckFile = function (url) {
    let imgSrc = false;
    try {
        const filenames = fs.readdirSync(url);
        filenames.forEach((filename) => {
            const fullPath = path.join(url, filename);
            const stats = fs.statSync(fullPath);
            if (stats.isFile()) {
                imgSrc = true;
                return imgSrc;
            }
        });        
    } catch (error) {
        
    }
    return imgSrc;
}

exports.searchPatient = function(tempPid = false, targetSec = 'sec2') {

    let query = '';
    let viewFile = '';
    let viewPdfFile = '';
    let pid = document.querySelector('#'+ targetSec +'-patientId').value;

    resetSearchForm();
    rinshoList.innerHTML = '';
    kakuteiList.innerHTML = '';
    imgList.innerHTML = '';
    document.getElementById("rinsho-msg").innerHTML = '';
    document.getElementById("kakutei-msg").innerHTML = '';

    if (document.getElementById('sec2-tempBtn') != null) {
        document.getElementById('sec2-tempBtn').remove();
    }
    if (tempPid) {
        pid = tempPid;
    }
    if (!pid) {
        alert("患者IDを入力してください"+ pid);
        return;
    }
    try {
        searchOnlyPatient(pid).then((res) => {
            if(res.length) {
                console.log(res);
                let ob = res[0];
                document.querySelector("#sec2-patientId").value = (ob["patientId"]) ? ob["patientId"] : '';
                document.querySelector("#sec2-lastName").value = (ob["lastName"]) ? ob["lastName"] : '';
                document.querySelector("#sec2-firstName").value = (ob["firstName"]) ? ob["firstName"] : '';
                document.querySelector("#sec2-birthday").value = (ob["birthday"]) ? ob["birthday"] : '';
                document.querySelector("#sec2-firstVisitDate").value = (ob["firstVisitDate"]) ? ob["firstVisitDate"] : '';
                document.querySelector("#sec2-age").value = (ob["age"]) ? ob["age"] : '';
                document.querySelector("#sec2-monthAge").value = (ob["monthAge"]) ? ob["monthAge"] : '';
                document.querySelector("#sec2-memo").innerText = (ob["memo"]) ? ob["memo"] : '';
                var element1 = document.getElementById('sec2-sex1');
                var element2 = document.getElementById('sec2-sex2');
                
                if (ob["sex"] == '男') {
                    element1.checked = true;
                }
                else {
                    element2.checked = true;
                }
                var element3 = document.getElementById('sec2-havImage');
                // document.querySelector("#firstName").value = row["firstName"];
                
                if (ob["havImage"] == 1) {
                    element3.checked = true;
                }
                else {
                    element3.checked = false;
                }
                onView('updPatient');
                onView('delPatient');
                offView('addPatient');
            }
            else {
                offView('updPatient');
                offView('delPatient');
                onView('addPatient');           
            }
        });
    } catch (error) {
        console.log(error);
    }
    
    try {
        findRinsho(pid, 'rinsho').then((res) => {
            if (res) {
                try {
                    let viewStr = jsSec2.viewPatientList(res, 5, 'rinsho');
                    rinshoList.innerHTML = viewStr;
                } catch (err) {
                    let viewStr = jsSec2.viewPatientListNull('rinsho');
                    rinshoList.innerHTML = viewStr;
                    console.log(err);
                }
            }
            else {
                
            }
        });
    } catch (error) {
        console.log(error);
    }

    try {
        findRinsho(pid, 'kakutei').then((res) => {
            // console.log(res);
            if (res) {
                try {
                    let viewStr = jsSec2.viewPatientList(res, 5, 'kakutei');
                    kakuteiList.innerHTML = viewStr;
                } catch (err) {
                    let viewStr = jsSec2.viewPatientListNull('kakutei');
                    kakuteiList.innerHTML = viewStr;
                    console.log(err);
                }
            }
        });
    } catch (error) {
        console.log(error);
    }

    for (let i = 0; i <= 5; i++) {
        if (document.getElementById("rinsho-diagnosis"+ i) != null) {
            document.getElementById("rinsho-diagnosis" + i).innerHTML = document.getElementById('diag-list').innerHTML;
        }
        if (document.getElementById("kakutei-diagnosis"+ i) != null) {
            document.getElementById("kakutei-diagnosis" + i).innerHTML = document.getElementById('diag-list').innerHTML;
        }
    }

    
    let imgSrc = printAllFiles('imgpath', pid, true);
    pid = ('0000000' + pid).slice(-7);
    let url = imgpath + pid;
    
    if (imgList) {
        // imgOutputs(pid);
        if (document.getElementById('sec2-tempBtn') != null) {
            document.getElementById('sec2-tempBtn').remove();
        }
        let tagA = document.createElement('button');
        tagA.innerText = '内包フォルダーを開く';
        tagA.setAttribute('id', 'sec2-tempBtn');
        tagA.setAttribute('onclick', 'openFolder(\'' + pid + '\',\'imgpath\')');
        imgList.before(tagA);

        let fileUrl;
        imgSrc.forEach((fileName) => {
        //     if (fileName.indexOf('.pdf') != -1 && fileName.indexOf('._') == -1) {
        //         fileUrl = 'file://' + url + sep + fileName;
        //         // if (process.platform == "win32") {
        //         //     // fileName = fileName.replace("\\", "\\\\");
        //         // }
        //         // else {
        //         //     fileUrl = 'file://' + url + sep + fileName;
        //         // }
        //         viewPdfFile += '<p class="w100p"><a href="javascript:void(0)" onclick="externalLink(\'imgpath\',\'' + pid + '\',\'' + fileName + '\')">' + fileName + '</a></p>';
        //     }
        //     else if (fileName.indexOf('.pdf') == -1) {
        //         fileUrl =  url + sep + fileName;
        //         // viewFile += '<object data="' + url + sep + fileName + '" class="small-image" onclick="jsSec2.previewImg(\''+ url + '\',\'' + fileName + '\')"></object>';
        //         viewFile += '<object data="' + fileUrl + '" class="small-image" onclick="jsSec2.previewImg_(\'' + pid + '\',\'' + fileName + '\')"></object>';
        //     }
        // });
            if (fileName.indexOf('.pdf') == -1) {
                fileUrl =  url + sep + fileName;
                // viewFile += '<object data="' + url + sep + fileName + '" class="small-image" onclick="jsSec2.previewImg(\''+ url + '\',\'' + fileName + '\')"></object>';
                viewFile += '<object data="' + fileUrl + '" class="small-image" onclick="jsSec2.previewImg_(\'' + pid + '\',\'' + fileName + '\')"></object>';
            }
            else if (fileName.indexOf('._') == -1) {
                fileUrl = 'file://' + url + sep + fileName;
                viewPdfFile += '<p class="w100p"><a href="javascript:void(0)" onclick="externalLink(\'imgpath\',\'' + pid + '\',\'' + fileName + '\')">' + fileName + '</a></p>';
            }
        });
        imgList.innerHTML = viewPdfFile + viewFile;

    }

    return false;

}

exports.viewPatientList = function(res, n, sec) {
    let listView = '';
    
    if (!loginUserLevel) {
        delete titleList[0];
    }

    titleList.forEach(element => {
        if (element[0]) {
            listView += '<div class="item" style="width:' + element[1] + '%">' + element[0] + '</div >';
        }
    });

    listView = '<div class="row thead-style">' + listView + '<div class="item"></div></div >';

    let key = 0;
    flg = false;

    if(res) {
        let opt = '';
        
        for (let i = 1; i <= n; i++) {
            if (res[key]['diagnosisCd' + i] || res[key]['diagnosis' + i]) {
                let row = res[key];
                flg = true;
                
                listView += '<div class="row fw-nw" id="' + sec + '-' + i + '">';
                
                if(loginUserLevel) {
                    listView += '<div class="item" style="width:' + titleList[0][1] + '%"><input type="button" id="' + sec + '-sel' + i + '" value="クリア" onclick="jsSec2.clearRec(\'' + sec + '\',' + i + ')"></div>';
                }
                
                listView += '<div class="item" style="width:' + titleList[1][1] + '%"><input type="text" id="'+ sec +'-diagnosisCd' + i + '" value="' + ((res[key]['diagnosisCd' + i]) ? res[key]['diagnosisCd' + i] : '') + '"></div>' +
                // '<div class="item" style="width:' + titleList[2][1] + '%"><input type="text" id="' + sec + '-diagnosis' + i + '" value="' + ((res[key]['diagnosis' + i]) ? res[key]['diagnosis' + i] : '') + '" list="diag-list" class="diagnosis" onchange="selectDiag(\'tbl_diagnosisName\',\'diagnosis_name\',this);" required></div>' +
                '<div class="item" style="width:' + titleList[2][1] + '%"><select id="' + sec + '-diagnosis' + i + '" list="diag-list" class="diagnosis" onchange="selectDiag(\'tbl_diagnosisName\',\'diagnosis_name\',this);" required>';
                opt = '<option value=""></option>';
                for (let i2 = 0; i2 < diagSelArr.length; i2++) {
                    opt += '<option value="' + diagSelArr[i2] + '"' + ((res[key]['diagnosis' + i] == diagSelArr[i2]) ? ' selected="selected"' : '') +'>' + diagSelArr[i2] + '</option>';
                }
                // listView += ' value="' + ((res[key]['diagnosis' + i]) ? res[key]['diagnosis' + i] : '') + '" list="diag-list" class="diagnosis" onchange="selectDiag(\'tbl_diagnosisName\',\'diagnosis_name\',this);" required>
                listView += opt + '</select></div>' +
                '<div class="item" style="width:' + titleList[3][1] + '%"><input type="text" id="'+ sec +'-etcDetail' + i + '" value="' + ((res[key]['etcDetail' + i]) ? res[key]['etcDetail' + i] : '') + '"></div>' +
                '<div class="item" style="width:' + titleList[4][1] + '%"><select id="'+ sec +'-judgment' + i + '">' +
                '<option value=""></option>' +
                '<option value="s/o"' + ((res[key]['judgment' + i] == 's/o') ? ' selected="selected"' : '') + '>s/o</option>' +
                '<option value="r/o"' + ((res[key]['judgment' + i] == 'r/o') ? ' selected="selected"' : '') + '>r/o</option>' +
                '<option value="p/o"' + ((res[key]['judgment' + i] == 'p/o') ? ' selected="selected"' : '') + '>p/o</option>' +
                '</select></div>' +
                '<div class="item" style="width:' + titleList[5][1] + '%"><select id="' + sec + '-part' + i + '" class="part">';
                opt = '<option value=""></option>';
                for(let i2 = 0; i2 < partSelArr.length; i2++) {
                    opt += '<option value="' + partSelArr[i2] + '"' + ((res[key]['part' + i] == partSelArr[i2]) ? ' selected="selected"':'') +'>' + partSelArr[i2] + '</option>';
                }
                listView += opt + '</select></div>' +
                '<div class="item" style="width:' + titleList[6][1] + '%"><input type="text" id="'+ sec +'-partCategory' + i + '" value="' + ((res[key]['partCategory' + i]) ? res[key]['partCategory' + i] : '') + '"></div>';
                if (i == 1 && loginUserLevel) {
                    listView += '<div class="item"><input type="button" value="＋" id="add-' + sec + '" onclick="jsSec2.addRec(this.id)"></div>';
                }
                else {
                    listView += '<div class="item"></div>'
                }
                listView += '</div>';
            }
            else if (res[key]['diagnosisCd' + i] == '' || res[key]['diagnosis' + i] == '') {
                let opt = '<option value=""></option>';

                listView += '<div class="row fw-nw" id="' + sec + '-' + i + '">';

                if(loginUserLevel) {
                    listView += '<div class="item" style="width:' + titleList[0][1] + '%"><input type="button" id="' + sec + '-sel' + i + '" value="クリア" onclick="jsSec2.clearRec(\'' + sec + '\',1)"></div>';
                }

                listView += '<div class="item" style="width:' + titleList[1][1] + '%"><input type="text" id="' + sec + '-diagnosisCd' + i + '"></div>' +
                    // listView += ' value="' + ((res[key]['diagnosis' + i]) ? res[key]['diagnosis' + i] : '') + '" list="diag-list" class="diagnosis" onchange="selectDiag(\'tbl_diagnosisName\',\'diagnosis_name\',this);" required>
                    '<div class="item" style="width:' + titleList[2][1] + '%"><select id="' + sec + '-diagnosis' + i + '" class="diagnosis" onchange="selectDiag(\'tbl_diagnosisName\',\'diagnosis_name\',this);" required>';
                for (let i2 = 0; i2 < diagSelArr.length; i2++) {
                    opt += '<option value="' + diagSelArr[i2] + '">' + diagSelArr[i2] + '</option>';
                }
                listView += opt + '</select></div>' +
                    // '<div class="item" style="width:' + titleList[2][1] + '%"><input type="text" id="' + sec + '-diagnosis' + i + '" list="diag-list" class="diagnosis" onchange="selectDiag(\'tbl_diagnosisName\',\'diagnosis_name\',this);"></div>' +
                    '<div class="item" style="width:' + titleList[3][1] + '%"><input type="text" id="' + sec + '-etcDetail' + i + '"></div>' +
                    '<div class="item" style="width:' + titleList[4][1] + '%"><select id="' + sec + '-judgment' + i + '">' +
                    '<option value=""></option>' +
                    '<option value="s/o">s/o</option>' +
                    '<option value="r/o">r/o</option>' +
                    '<option value="p/o">p/o</option>' +
                    '</select></div>' +
                    '<div class="item" style="width:' + titleList[5][1] + '%"><select id="' + sec + '-part' + i + '" class="part">';
                opt = '<option value=""></option>';
                for (let i2 = 0; i2 < partSelArr.length; i2++) {
                    opt += '<option value="' + partSelArr[i2] + '">' + partSelArr[i2] + '</option>';
                }
                listView += opt + '</select></div>' +
                    '<div class="item" style="width:' + titleList[6][1] + '%"><input type="text" id="' + sec + '-partCategory' + i + '"></div>';
                if (i == 1 && loginUserLevel) {
                    listView += '<div class="item"><input type="button" value="＋" id="add-' + sec + '" onclick="jsSec2.addRec(this.id)"></div>';
                }
                else {
                    listView += '<div class="item"></div>'
                }
                listView += '</div>';
            }
            else {
                break;
            }
        }
    }

    return listView;
}

exports.viewPatientListNull = function(sec) {
    let listView = '';

    if (!loginUserLevel) {
        delete titleList[0];
    }

    titleList.forEach(element => {
        if(element[0]) {
            listView += '<div class="item" style="width:' + element[1] + '%">' + element[0] + '</div >';
        }
    });
    listView = '<div class="row thead-style">' + listView + '<div class="item"></div></div >';

    let opt = '<option value=""></option>';

    listView += '<div class="row fw-nw" id="' + sec + '-1">' +
        '<div class="item" style="width:' + titleList[0][1] + '%"><input type="button" id="' + sec + '-sel1" value="クリア" onclick="jsSec2.clearRec(\'' + sec + '\',1)"></div>' +
        '<div class="item" style="width:' + titleList[1][1] + '%"><input type="text" id="' + sec + '-diagnosisCd1"></div>' +
        // listView += ' value="' + ((res[key]['diagnosis' + i]) ? res[key]['diagnosis' + i] : '') + '" list="diag-list" class="diagnosis" onchange="selectDiag(\'tbl_diagnosisName\',\'diagnosis_name\',this);" required>
        '<div class="item" style="width:' + titleList[2][1] + '%"><select id="' + sec + '-diagnosis1" class="diagnosis" onchange="selectDiag(\'tbl_diagnosisName\',\'diagnosis_name\',this);" required>';
    opt = '<option value=""></option>';
    for (let i2 = 0; i2 < diagSelArr.length; i2++) {
        opt += '<option value="' + diagSelArr[i2] + '">' + diagSelArr[i2] + '</option>';
    }
    listView += opt + '</select></div>' +
        // '<div class="item" style="width:' + titleList[2][1] + '%"><input type="text" id="' + sec + '-diagnosis1" list="diag-list" class="diagnosis" onchange="selectDiag(\'tbl_diagnosisName\',\'diagnosis_name\',this);"></div>' +
        '<div class="item" style="width:' + titleList[3][1] + '%"><input type="text" id="' + sec + '-etcDetail1"></div>' +
        '<div class="item" style="width:' + titleList[4][1] + '%"><select id="' + sec + '-judgment1">' +
        '<option value=""></option>' +
        '<option value="s/o">s/o</option>' +
        '<option value="r/o">r/o</option>' +
        '<option value="p/o">p/o</option>' +
        '</select></div>' +
        '<div class="item" style="width:' + titleList[5][1] + '%"><select id="' + sec + '-part1" class="part">';
    opt = '<option value=""></option>';
    for (let i2 = 0; i2 < partSelArr.length; i2++) {
        opt += '<option value="' + partSelArr[i2] + '">' + partSelArr[i2] + '</option>';
    }
    listView += opt + '</select></div>' +
        // '<div class="item" style="width:' + titleList[5][1] + '%"><input type="text" id="' + sec + '-part1"></div>' +
        '<div class="item" style="width:' + titleList[6][1] + '%"><input type="text" id="' + sec + '-partCategory1"></div>' +
        '<div class="item"><input type="button" value="＋" id="add-' + sec + '" onclick="jsSec2.addRec(this.id)"></div>' +
        '</div>';
    return listView;
}

exports.addRec = function(sec) {
    sec = sec.replace('add-', '');
    let objList = (sec == "rinsho") ? rinshoList:kakuteiList;
    let opt = '<option value=""></option>';

    if (objList.childElementCount <= 5) {
        listView = '<div class="row" id="' + sec + '-' + objList.childElementCount + '">' +
        '<div class="item" style="width:' + titleList[0][1] + '%"><input type="button" id="' + sec + '-sel' + objList.childElementCount + '" value="クリア" onclick="jsSec2.clearRec(\'' + sec + '\',' + objList.childElementCount + ')"></div>' +
        '<div class="item" style="width:' + titleList[1][1] + '%"><input type="text" id="' + sec + '-diagnosisCd' + objList.childElementCount + '"></div>' +
        '<div class="item" style="width:' + titleList[2][1] + '%"><select id="' + sec + '-diagnosis' + objList.childElementCount + '" class="diagnosis" onchange="selectDiag(\'tbl_diagnosisName\',\'diagnosis_name\',this);" required>';
        for (let i2 = 0; i2 < diagSelArr.length; i2++) {
            opt += '<option value="' + diagSelArr[i2] + '">' + diagSelArr[i2] + '</option>';
        }
        listView += opt + '</select></div>' +
        // '<div class="item" style="width:' + titleList[2][1] + '%"><input type="text" id="' + sec + '-diagnosis' + objList.childElementCount + '" list="diag-list" class="diagnosis" onchange="selectDiag(\'tbl_diagnosisName\',\'diagnosis_name\',this)"></div>' +
        '<div class="item" style="width:' + titleList[3][1] + '%"><input type="text" id="'+ sec +'-etcDetail' + objList.childElementCount + '"></div>' +
        '<div class="item" style="width:' + titleList[4][1] + '%"><select id="'+ sec +'-judgment' + objList.childElementCount + '">' +
        '<option value=""></option>' +
        '<option value="s/o">s/o</option>' +
        '<option value="r/o">r/o</option>' +
        '<option value="p/o">p/o</option>' +
        '</select></div>' +
        '<div class="item" style="width:' + titleList[5][1] + '%"><select id="' + sec + '-part' + objList.childElementCount + '" class="part">';
        opt = '<option value=""></option>';
        for (let i2 = 0; i2 < partSelArr.length; i2++) {
            opt += '<option value="' + partSelArr[i2] + '">' + partSelArr[i2] + '</option>';
        }
        listView += opt + '</select></div>' +
        // '<div class="item" style="width:' + titleList[5][1] + '%"><input type="text" id="'+ sec +'-part' + objList.childElementCount + '"></div>' +
        '<div class="item" style="width:' + titleList[6][1] + '%"><input type="text" id="'+ sec +'-partCategory' + objList.childElementCount + '"></div>' +
        '<div class="item" style="width:' + titleList[7][1] + '%"></div>' +
        '</div>';
        objList.insertAdjacentHTML('beforeend', listView);
    }
    else {
        alert('これ以上は登録できません');
    }
}

exports.delRec = function(sec) {
    let objList = (sec == "rinsho") ? rinshoList:kakuteiList;
    let opt = '<option value=""></option>';

    if (objList.childElementCount <= 5) {
        listView = '<div class="row" id="' + sec + '-' + objList.childElementCount + '">' +
        '<div class="item" style="width:' + titleList[0][1] + '%"><input type="button" id="' + sec + '-sel' + objList.childElementCount + '" value="クリア" onclick="jsSec2.clearRec(\'' + sec + '\',' + objList.childElementCount + ')"></div>' +
        '<div class="item" style="width:' + titleList[1][1] + '%"><input type="text" id="' + sec + '-diagnosisCd' + objList.childElementCount + '"></div>' +
        // '<div class="item" style="width:' + titleList[2][1] + '%"><input type="text" id="' + sec + '-diagnosis' + objList.childElementCount + '" list="diag-list" class="diagnosis" onchange="selectDiag(\'tbl_diagnosisName\',\'diagnosis_name\',this)"></div>' +
        '<div class="item" style="width:' + titleList[2][1] + '%"><select id="' + sec + '-diagnosis1" class="diagnosis" onchange="selectDiag(\'tbl_diagnosisName\',\'diagnosis_name\',this);" required>';
        for (let i2 = 0; i2 < diagSelArr.length; i2++) {
            opt += '<option value="' + diagSelArr[i2] + '">' + diagSelArr[i2] + '</option>';
        }
        listView += opt + '</select></div>' +
        '<div class="item" style="width:' + titleList[3][1] + '%"><input type="text" id="'+ sec +'-etcDetail' + objList.childElementCount + '"></div>' +
        '<div class="item" style="width:' + titleList[4][1] + '%"><select id="'+ sec +'-judgment' + objList.childElementCount + '">' +
        '<option value=""></option>' +
        '<option value="s/o">s/o</option>' +
        '<option value="r/o">r/o</option>' +
        '<option value="p/o">p/o</option>' +
        '</select></div>' +
        '<div class="item" style="width:' + titleList[5][1] + '%"><select id="' + sec + '-part' + objList.childElementCount + '" class="part">';
        opt = '<option value=""></option>';
        for (let i2 = 0; i2 < partSelArr.length; i2++) {
            opt += '<option value="' + partSelArr[i2] + '"' + ((res[key]['part' + objList.childElementCount] == partSelArr[i2]) ? ' selected="selected"' : '') + '>' + partSelArr[i2] + '</option>';
        }
        listView += opt + '</select></div>' +
        // '<div class="item" style="width:' + titleList[5][1] + '%"><input type="text" id="'+ sec +'-part' + objList.childElementCount + '"></div>' +
        '<div class="item" style="width:' + titleList[6][1] + '%"><input type="text" id="'+ sec +'-partCategory' + objList.childElementCount + '"></div>' +
        '<div class="item" style="width:' + titleList[7][1] + '%"></div>' +
        '</div>';
        objList.insertAdjacentHTML('beforeend', listView);
    }
    else {
        alert('これ以上は登録できません');
    }
}

exports.updPatient = function (sec = 'sec2') {
    let query = '';
    query = "update tbl_patients set ";
    let inpData = [];

    for (ky in indexArr) {
        inpData[indexArr[ky][0]] = document.querySelector("#" + sec + "-" + indexArr[ky][0]).value;
        // inpData[indexArr[ky][0]] = "#" + sec + "-" + indexArr[ky][0];
    }
    let element1 = document.getElementById('sec2-sex1');
    let element2 = document.getElementById('sec2-sex2');
    inpData['sex'] = (element1.checked) ? '男' : ((element2.checked) ? '女' : '');

    let element3 = document.getElementById('sec2-havImage');
    inpData["havImage"] = (element3.checked) ? 1 : 0;

    let addQuery = '';
    let addSep = '';

    let shindan = ['rinsho','kakutei'];
console.log(inpData);
    for (key in indexArr) {
        // if (inpData[indexArr[key][0]]) {
            console.log(inpData[indexArr[key][0]]);
            if (addQuery != '') {
                addSep = ',';
            }
            if (indexArr[key][2]) {
                addQuery += addSep + indexArr[key][0] + "='" + inpData[indexArr[key][0]] + "'";
            }
            else if (isNumber(inpData[indexArr[key][0]])){
                addQuery += addSep + indexArr[key][0] + "=" + inpData[indexArr[key][0]];
            }
        // }
    }
    query += addQuery + " where patientId=" + inpData['patientId'];
console.log(query);
    try {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(dbpath);
            db.run(query, (err, rows) => {
                if (err == null) {
                    for (let i = 0; i < shindan.length; i++) {
                        try {
                            jsSec2.addRinshoList(inpData['patientId'], shindan[i]);
                        } catch (error) {
                            
                        }
                    }
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

    // console.log(query);
}
exports.delPatient = function () {
    document.getElementById('sec2-confirm').style.display = 'none';

    let query = [];
    let tblArr = [
        'tbl_surgicalOperation',
        'tbl_rinsho',
        'tbl_patients',
        'tbl_medicalHistory',
        'tbl_kakutei',
        'tbl_byoriShindan',
        'tbl_byoriKakutei'
    ];
    let pid = document.querySelector("#sec2-patientId").value;

    tblArr.forEach(tbl => {
        query = "delete from " + tbl + " where patientId=?";
        jsSec2.delPatientExec(query,pid);
    });

}
    
exports.delPatientExec = function (query, pid) {
    try {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(dbpath);
            db.run(query, pid, (err, rows) => {
                if (err == null) {
                    resetSearchForm();
                    rinshoList.innerHTML = '';
                    kakuteiList.innerHTML = '';
                    imgList.innerHTML = '';
                    document.getElementById("rinsho-msg").innerHTML = '';
                    document.getElementById("kakutei-msg").innerHTML = '';

                    if (document.getElementById('sec2-tempBtn') != null) {
                        document.getElementById('sec2-tempBtn').remove();
                    }
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

exports.addPatient = function (sec) {
    let query = '';
    query = "insert into tbl_patients";
    let inpData = [];

    
    for (ky in indexArr) {
        inpData[indexArr[ky][0]] = document.querySelector("#" + sec + "-" + indexArr[ky][0]).value;
        // inpData[indexArr[ky][0]] = "#" + sec + "-" + indexArr[ky][0];
    }

    let element1 = document.getElementById('sec2-sex1');
    let element2 = document.getElementById('sec2-sex2');
    inpData['sex'] = (element1.checked) ? '男' : ((element2.checked) ? '女':false);
    let element3 = document.getElementById('sec2-havImage');
    inpData["havImage"] = (element3.checked) ? 1 : 0;
    
    let addIndex = '';
    let addQuery = '';
    let shindan = ['rinsho', 'kakutei'];

    let errFlg = false;

    if(!inpData['patientId']) {
        orgConfirm('sec2','患者IDを入力してください');
        errFlg = true;
    }
    else if(!inpData['lastName']) {
        orgConfirm('sec2','名字を入力してください');
        errFlg = true;
    }
    else if(!inpData['firstName']) {
        orgConfirm('sec2','名前を入力してください');
        errFlg = true;
    }
    else if(!inpData['sex']) {
        orgConfirm('sec2','性別を選択してください');
        errFlg = true;
    }
    let row = getDbSelect('tbl_patients', inpData['patientId'], 'patientId');
    console.log(row);
    if(row.length) {
        orgConfirm('sec2','既に患者IDが存在します');
        errFlg = true;
    }
    if(errFlg) return;
    
    for (key in indexArr) {
        if (inpData[indexArr[key][0]]) {
            if (addQuery != '') {
                addIndex += ',';
                addQuery += ',';
            }
            if (indexArr[key][2]) {
                addIndex += indexArr[key][0];
                addQuery += "'" + inpData[indexArr[key][0]] + "'";
            }
            else {
                addIndex += indexArr[key][0];
                addQuery += inpData[indexArr[key][0]];
            }
        }
    }
    query += "(" + addIndex + ") values(" + addQuery + ")";

    try {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(dbpath);
            db.run(query, (err, rows) => {
                if (err == null) {

                    orgConfirm('sec2','<p>新患登録を行いました。</p>');
                    for (let i = 0; i < shindan.length; i++) {
                        try {
                            jsSec2.addRinshoList(inpData['patientId'], shindan[i]);
                        } catch (error) {

                        }
                    }
                    resolve(rows);
                }
                else {
                    orgConfirm('sec2','<p>追加できませんでした。</p>');
                    reject(err);
                }
            });

            db.close();
        });
    } catch (err_1) {
        alert(err_1.message);
    }

    query = "insert into tbl_rinsho(patientId) values('" + inpData['patientId'] + "')";

    try {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(dbpath);
            db.run(query, (err, rows) => {
                if (err == null) {
                    resolve(rows);
                }
                else {
                    alert("DB_ERROR");
                    reject(err);
                }
            });
            db.close();
        });
    } catch (err_2) {
        alert(err_2.message);
    }
    console.log(query);
}

exports.addRinshoList = function (pid, shindan = 'rinsho') {
    let updFlg = 0;
    
    let query = "select * from tbl_" + shindan + " where patientId=?";
    findDbToPid(query, pid).then((res) => {

        if(res.length) {
            updFlg = 1;
        }

        let addIndex = '';
        let addVal = '';
        let valArr = [];
        let msg = '';

        for (i = 1; i <= 5; i++) {
            if (document.getElementById(shindan + '-' + i)) {
                for (let n = 0; n < entryIndex.length; n++) {
                    valArr.push(document.getElementById(shindan + "-" + entryIndex[n] + i).value);
                    if (updFlg) {
                        if (i == 1 && n == 0) {
                        }
                        else {
                            addVal += ",";
                        }
                        addVal += entryIndex[n] + i +"=?";
                        // addVal += entryIndex[n] + i +"='" + document.getElementById(shindan + "-" + entryIndex[n] + i).value + "'";
                    }
                    else {
                        if (i == 1 && n == 0) {
                        }
                        else {
                            addIndex += ",";
                            addVal += ",";
                        }
                        addIndex += entryIndex[n] + i;
                        addVal += "?";
                        // addVal += "'" + document.getElementById(shindan + "-" + entryIndex[n] + i).value + "'";
                    }
                }
                if (updFlg) {
                    query = "update tbl_" + shindan + " set " + addVal + " where patientId=" + pid;
                }
                else {
                    query = "insert into tbl_" + shindan + "(patientId," + addIndex + ") values(" + pid + "," + addVal + ")";
                }

                addRecord(query,valArr).then((res) => {
                    if(res) {
                        msg = res;
                    }
                });
            }
        }
        orgConfirm('sec2','更新が完了しました');
    });
}

exports.clearRec = function(sec,ky) {
    let ele;
    for (let i = 0; i < entryIndex.length; i++) {
        ele = document.getElementById(sec + '-' + entryIndex[i] + ky);
        ele.value = '';
    }
}


exports.previewImg = function(url, filePath) {

    let imgViewer = $("#img-viewer");
    const img = document.createElement('object');
    if (filePath.indexOf('.pdf') != -1) {
        img.setAttribute('type', 'application/pdf');
        img.setAttribute('width', '100%');
        img.setAttribute('height', '100%');
    }
    img.setAttribute('data', path.join(url, filePath));
    document.getElementById('img-viewer').appendChild(img);
    img.setAttribute('onclick', 'jsSec2.closeView()');
    imgViewer.css('pointerEvents', 'auto');
}

exports.previewImg_ = function(pid, url, sec = '') {
    pid = ('0000000' + pid).slice(-7);
    url = imgpath + pid + sep + url;
    let obj = '<object data="' + url + '" onclick="jsSec2.closeView(\'' + sec + '\');">';
    document.getElementById(((sec != '') ? sec + '-': sec) + 'img-viewer').innerHTML = obj;
    document.getElementById(((sec != '') ? sec + '-': sec) + 'img-viewer').style.pointerEvents = 'auto';
}

exports.closeView = function(sec = '') {
    let imgViewer = $("#" + ((sec != '') ? sec + '-': sec) + "img-viewer");
    imgViewer.empty();
    imgViewer.removeAttr('style');
}