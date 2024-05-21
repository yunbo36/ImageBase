// const { fromStream } = require("file-type");

exports.masterEntry = async function() {
    var dbfilepath = document.querySelector("#dbFilePath").value;
    var imgfilepath = document.querySelector("#imgFilePath").value;
    var pdf1filepath = document.querySelector("#pdf1FilePath").value;
    var pdf2filepath = document.querySelector("#pdf2FilePath").value;
    var pdf3filepath = document.querySelector("#pdf3FilePath").value;
    let res = [{}];

    var setSettingsLocalStrage = () => {

        if(dbfilepath) {
            res[0].dbPath = dbpath = dbfilepath;
            localStorage.setItem('dbPath',dbpath);
            flg = true;
        }
        if(imgfilepath) {
            res[0].imgPath = imgpath = imgfilepath;
            localStorage.setItem('imgPath',imgpath);
            flg = true;
        }
        if(pdf1filepath) {
            res[0].pdf1Path = pdf1path = pdf1filepath;
            localStorage.setItem('pdf1Path',pdf1path);
            flg = true;
        }
        if(pdf2filepath) {
            res[0].pdf2Path = pdf2path = pdf2filepath;
            localStorage.setItem('pdf2Path',pdf2path);
            flg = true;
        }
        if(pdf3filepath) {
            res[0].pdf3Path = pdf3path = pdf3filepath;
            localStorage.setItem('pdf3Path',pdf3path);
            flg = true;
        }
    }

    await setSettingsLocalStrage();

    document.getElementById("fin-msg").innerHTML = "設定を保存しました";

    if (!sessionStorage.getItem('loginUser')) {
        document.getElementById("fin-msg").innerHTML += "。ログインするにはImageBaseを一度閉じて再起動してください。";
    }
        
    // if(flg) {
    //     fs.writeFileSync(
    //         './settings.json',
    //         JSON.stringify(res)
    //     );
    // }
}

exports.desableOprationSec9 = function() {
    document.getElementById('sec9-wait-bg').style.display = 'block';
    setTimeout(() => {
        jsSec9.checkImgFolder();
    }, 800);
}

exports.checkImgFolder = async function() {
    var execEntry = () => {
        getDbAll('tbl_patients').then((res) => {
            if(res) {
                for(let ky in res) {
                    let pid = ('0000000' + res[ky]['patientId']).slice(-7);
                    let path = imgpath + sep + pid;
                    if(fs.existsSync(path)) {
                        setImageFlg(res[ky]['patientId']);
                    }
                    else {
                        setImageFlg(res[ky]['patientId'], 0);
                    }
                }
            }
        });
    }
    await execEntry();


        // filenames.forEach((filename) => {
        //     // let fullPath = path.join(url, filename);
        //     let fullPath = imgpath + sep + filename;
        //     let stats = fs.statSync(fullPath);
        //     if (stats.isDirectory()) {
        //         console.log(filename);
        //     }
        // });
    
    orgConfirm("sec9", "同期が完了しました", "desableOprationBgHidden", "sec9");
}
