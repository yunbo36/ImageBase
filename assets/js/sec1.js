function addTblHead() {
    document.getElementById("sec1-thead").html(table);
}

function searchPatientList(targetEle) {
    document.getElementById("sec1-main").removeAttribute('style');
    document.getElementById("sec1-img-list").innerHTML = '';

    let query = '';
    let queryAdd = '1';
    let inps = document.getElementsByClassName("search-input");
    let types = [{
        'patientId': 0,
        'lastName': 1,
        'firstName': 1,
        'birthday': 1,
        'firstVisitDate': 1,
        'havImage': 0,
        'diagnosis1': 1,
        'part1': 1
    }];

    resetSearchForm("sec1");
    imgList.innerHTML = '';
    
    // rinshoList.innerHTML = '';
    // byoriList.innerHTML = '';
    // imgView.innerHTML = '';
    // let dbPath = "/Volumes/LOGIRAID/Imagebase/db/mydata.db";
    let db = new sqlite3.Database(dbpath);
    let tblIndex = [];
    let n = 0;
    
    for (let i = 0; i < inps.length; i++) {
        const element = inps[i];
        const ids = element.id;
        let str = ids.replace('sec1-', '');
        
        if (element.value) {
            tblIndex[n] = { key: str, val: element.value };
        }
        n++;
    }
    let flg = false;
    query = "select *,t1.id,t1.patientId from tbl_patients as t1 left join tbl_rinsho as t2 on t1.patientId = t2.patientId where ";
    tblIndex.forEach(element => {
        // alert(element.key);
        if (flg) {
            if (element.key.indexOf('diagnosis') > -1 || element.key.indexOf('part') > -1) {
                queryAdd += " and t2.";
            }
            else {
                queryAdd += " and t1.";
            }
        }
        else {
            if (element.key.indexOf('diagnosis') > -1 || element.key.indexOf('part') > -1) {
                queryAdd = "t2.";
            }
            else {
                queryAdd = "t1.";
            }
        }
        if (types[0][element.key]) {
            // if (element.key == 'firstVisitDate' || element.key == 'birthday') {
            //     alert(element.key);
            //     let date = element.val.replace("/", /-/g);
            //     queryAdd += element.key + "='" + date + "'";
            // }
            // else {
            //     queryAdd += element.key + "='" + element.val + "'";
            // }
            queryAdd += element.key + "='" + element.val.replace("'","''") + "'";
        }
        else {
            queryAdd += element.key + "=" + element.val;
        }
        flg = true;
    });
    let elements = document.getElementsByName('sex');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const ids = element.id;
        let str = ids.replace('sec1-', '');

        // alert(element.checked);
        if (element.checked != false) {
            if(queryAdd.lastIndexOf("where") != 0) {
                queryAdd += " and ";
            }
            queryAdd += "t1.sex='" + element.value + "'";
        }
    }
    elements = document.getElementsByName('monthAge');

    if (elements[0].value != '') {
        if(queryAdd.lastIndexOf("where") != 0) {
            queryAdd += " and ";
        }
        queryAdd += "t1.monthAge='" + elements[0].value + "'";
    }

    elements = document.getElementsByName('havImage');

    if (elements[0].checked) {
        if(queryAdd.lastIndexOf("where") != 0) {
            queryAdd += " and ";
        }
        queryAdd += "havImage='" + elements[0].value + "'";
    }
    queryAdd += " order by t1.id asc";

    query += queryAdd;
    // alert(query);
    makeTable(targetEle, query);

    return false;
    
}

function resToTable(res) {
    console.log(res);
    let html = '';
    let num = 0;
    let tempnum = 0;
    let grpDiagNum = {
        'diagnosisCd1': 1,
        'diagnosis1': 1,
        'etcDetail1': 1,
        'judgment1': 1,
        'part1': 1,
        'partCategory1': 1,
        'diagnosisCd2': 2,
        'diagnosis2': 2,
        'etcDetail2': 2,
        'judgment2': 2,
        'part2': 2,
        'partCategory2': 2,
        'diagnosisCd3': 3,
        'diagnosis3': 3,
        'etcDetail3': 3,
        'judgment3': 3,
        'part3': 3,
        'partCategory3': 3,
        'diagnosisCd4': 4,
        'diagnosis4': 4,
        'etcDetail4': 4,
        'judgment4': 4,
        'part4': 4,
        'partCategory4': 4,
        'diagnosisCd5': 5,
        'diagnosis5': 5,
        'etcDetail5': 5,
        'judgment5': 5,
        'part5': 5,
        'partCategory5': 5
    };
    let onCheck = {
        'patientId': 1,
        'birthday': 1,
        'age': 1,
        'monthAge': 1,
        'sex': 1,
        'lastName': 1,
        'firstName': 1,
        'firstVisitDate': 1,
        'memo': 0,
        'havImage': 1,
        'diagnosisCd1': 1,
        'diagnosis1': 1,
        'etcDetail1': 1,
        'judgment1': 1,
        'part1': 1,
        'partCategory1': 1,
        'diagnosisCd2': 0,
        'diagnosis2': 0,
        'etcDetail2': 0,
        'judgment2': 0,
        'part2': 0,
        'partCategory2': 0,
        'diagnosisCd3': 0,
        'diagnosis3': 0,
        'etcDetail3': 0,
        'judgment3': 0,
        'part3': 0,
        'partCategory3': 0,
        'diagnosisCd4': 0,
        'diagnosis4': 0,
        'etcDetail4': 0,
        'judgment4': 0,
        'part4': 0,
        'partCategory4': 0,
        'diagnosisCd5': 0,
        'diagnosis5': 0,
        'etcDetail5': 0,
        'judgment5': 0,
        'part5': 0,
        'partCategory5': 0
    };

    let checked = '';


    let table = '<table class="table table-striped"><thead class="thead-dark"><tr>';
    // table += '<th></th>';
    table += '<th></th>';

    for (let ky in listTitle) {
        if (grpDiagNum[ky] >= 1) {
            num = 100 + grpDiagNum[ky];
        }
        else {
            num++;
        }

        checked = (onCheck[ky]) ? ' checked="checked"': '';
        if(onCheck[ky]) {
            table += '<th scope="col" class="f' + num + '">' + listTitle[ky] + '</th>';
        }
        else {
            table += '<th scope="col" class="f' + num + ' offView">' + listTitle[ky] + '</th>';
        }
        if (num == tempnum) continue;
        html += '<label class="item flex-row flex-ai-center" for="f' + num + '">';
        if(onCheck[ky]) {
            html += '<input type="checkbox" name="f' + num + '" id="f' + num + '"' + checked + ' onclick="hiddenField(\'f' + num + '\')" class="onViewEle">';
        }
        else {
            html += '<input type="checkbox" name="f' + num + '" id="f' + num + '"' + checked + ' onclick="hiddenField(\'f' + num + '\')" class="offViewEle">';
        }
        if (grpDiagNum[ky] >= 1) {
            html += '診断' + grpDiagNum[ky];
        }
        else {
            html += listTitle[ky];
        }
        html += '</label >';
        tempnum = num;
    }

    table += '</tr></thead><tboby>';
    num = 0;
    let listCount = 0;
    for (let ky in res) {

        let ob = res[ky];
        let url = imgpath + ob['patientId'];
        num = 0;

        table += '<tr>';

        table += '<td><a href="javascript:void(0);" onclick="detailView(' + ob['patientId'] + ')">詳細</a></td>';
        for (let ky2 in ob) {
            if(!listTitle[ky2])continue;
            if (grpDiagNum[ky2] >= 1) {
                num = 100 + grpDiagNum[ky2];
            }
            else {
                num++;
            }

            if(onCheck[ky2]) {
                table += '<td class="f' + num + '">';
            }
            else {
                table += '<td class="f' + num + ' offView">';
            }

            if (ky2 == 'patientId') {
                table += (ob['havImage']) ? '<a href="javascript:void(0);" onclick="sec1ImgStock(' + ob['patientId'] + ',this);">' + ob[ky2] + '</a>' : ob[ky2];
            }
            else if (ky2 == 'havImage') {
                table += (ob[ky2] == 1) ? '<a href="javascript:void(0);" onclick="sec1ImgView(' + ob['patientId'] + ')">画像</a> | <a href="javascript:void(0);" onclick="desableOpration(\'sec1\',' + ob['patientId'] + ',true);">保存</a>' : '';
            }
            else {
                table += (ob[ky2]) ? ob[ky2] : '';
            }
            table += '</td>';
        }
        table += '</tr>';
        listCount++;

    }
    table += '</tbody></table>';
    if(listCount <= 800) {
        document.getElementById("pickupFields").innerHTML = html;
    }
    return [table, listCount];
}

function makeTable(index, query) {

    findall(query).then((res) => {
        if (res.length) {
            let targetEle = document.querySelector(index);
            let listData = resToTable(res);
            document.getElementById("list-count").innerHTML = "<p>検索結果：" + listData[1] + "件</p>";
            targetEle.innerHTML = listData[0];
        }
        else {
            alert("検索結果がありません");
        }
    });
}

function detailView(pid) {
    copyTextToClipboard(pid);

    loadPage('sec2')
    window.setTimeout(function () {
        jsSec2.searchPatient(pid);
    }, 1000);
}

function sec1ImgView(pid) {
    pid = ('0000000' + pid).slice(-7);
    resetSearchForm("sec1");
    let metaLink = '';
    let viewFile = '';
    let viewPdfFile = '';
    let url = imgpath + pid;
    let imgSrc = printAllFiles('imgpath', pid, true);
    
    // alert(url);
    if (imgList) {
        document.getElementById("sec1-main").style.width = "64%";
        if (document.getElementById('sec1-tempBtn') != null) {
            document.getElementById('sec1-tempBtn').remove();
        }
        let tagA = document.createElement('button');
        tagA.innerText = '内包フォルダーを開く';
        tagA.setAttribute('id', 'sec1-tempBtn');
        // let folderPath = imgpath + pid;
        tagA.setAttribute('onclick', 'openFolder(\'' + pid + '\',\'imgpath\')');
        // tagA.setAttribute('onclick', 'shell.showItemInFolder("'+ folderPath +'")');
        tagA.setAttribute('class', 'w98p');
        
        imgSrc.forEach((filePath) => {
            if (filePath.indexOf('.pdf') == -1){
                // viewFile += '<object data="' + url + sep + filePath + '" class="big-image"></object>';
                viewFile += '<object data="' + url + sep + filePath + '" class="big-image" onclick="jsSec2.previewImg_(\'' + pid + '\',\'' + filePath + '\', \'sec1\')"></object>';
            }
            else if (filePath.indexOf('._') == -1) {
                viewPdfFile += '<object data="' + url + sep + filePath + '" type="application/pdf" class="pdf-image"></object>';
                viewPdfFile += '<p class="w100p"><a href="javascript:void(0)" onclick="externalLink(\'imgpath\',\'' + pid + '\',\'' + filePath + '\')">' + filePath + '</a></p>';
            }
        });

        metaLink += '<p>';
        metaLink += '<a href="javascript:void(0);" onclick="sec1ImgStock(' + pid + ');">保存リストに追加</a>｜';
        metaLink += '<a href="javascript:void(0);" onclick="desableOpration(\'sec1\',' + pid + ',true);">個別保存</a>｜';
        metaLink += '<a href="javascript:void(0);" onclick="detailView(' + pid + ')">詳細</a>';
        metaLink += '</p>';

        // alert(viewPdfFile + viewFile);
        imgList.innerHTML = metaLink + viewPdfFile + viewFile;
        imgList.prepend(tagA);
    }

}

function sec1ImgStock(pid, obj=false) {
    document.getElementById("imgOutputList").value += pid + "\n";
    if(obj)obj.style.background = "yellow";
}

