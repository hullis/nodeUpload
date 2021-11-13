'use strict';
const fs = require('fs')
const git = require('simple-git')
const schedule = require('node-schedule');

var express = require('express'),
    path = require('path'),
    app = express(),
    logger = require('morgan'),
    multer = require('multer');

var config = {
    host: 'localhost',
    port: 8008
};

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'www')));
app.set('views', path.join(__dirname, 'www'));

/* GET home page. */
app.get('/', function (req, res, next) {
    res.render('index', {
        title: '上传页面'
    });
});

/* config the multer storage */
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './www/img')
    },
    filename: function (req, file, cb) {
        // cb(null, file.originalname) //用图片原始名字，遇到名字重复会覆盖
        // 将保存文件名设置为 时间戳，比如 1478521468943
        let suffix = file.mimetype.split('/')[1]; //获取文件格式
        cb(null, Date.now() + '.' + suffix);
    }
});
var upload = multer({
    storage: storage
});


/**
 * 初始化git
 */
let gitEntity = git("D:/www/temp/node")

function upDataFile() {
    const time = Date()
    gitCommit(time)
}
// commit 提交
function gitCommit(time) {
    gitEntity.status().then(res => {
        const not_added = res.not_added.length === 0;
        const created = res.created.length === 0;
        const deleted = res.deleted.length === 0;
        const modified = res.modified.length === 0;
        const renamed = res.renamed.length === 0;
        if (not_added && created && deleted && modified && renamed) return false;

        gitEntity
            .add('./*')
            .commit('docs：文档更新')
            .push(['-u', 'origin', 'master'], (e) => {
                console.log('commit 成功，时间：' + time)
            })
    })
}

// 取消定时器
function scheduleCancel(){
    var counter = 1;
    const j = schedule.scheduleJob('* * * * * *', function(){
        console.log('定时器触发次数：' + counter);
        counter++;
    });
    setTimeout(function() {
        console.log('定时器取消')
      // 定时器取消
        j.cancel();
    }, 5000);
}

// *  *  *  *  *  *
// │  │  │ │  │  |
// │  │  │ │  │  └ day of week (0 - 7) (0 or 7 is Sun)
// │  │  │ │  └───── month (1 - 12)
// │  │  │ └────────── day of month (1 - 31)
// │  │  └─────────────── hour (0 - 23)
// │  └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)
function scheduleObjectLiteralSyntax(){
    //每分钟的第30秒定时执行一次:
    schedule.scheduleJob('10 * * * * *',()=>{
        console.log('scheduleCronstyle:' + new Date());
        upDataFile()
    }); 
}

//单文件上传，多文件上传参考https://github.com/expressjs/multer
app.post('/upload', upload.single('file'), function (req, res) {

    if (req.file) {
        res.send('文件上传成功')
        console.log(req.file);
        /* 输出示例
        {
          fieldname: 'file', 提交的参数名称，例如需form的input[name=file]
          originalname: 'Hydra.jpg',
          encoding: '7bit',
          mimetype: 'image/png',
          destination: './www/img',
          filename: 'Hydra.jpg'
          path: 'www\\img\\Hydra.jpg',
          size: 264794 
        }*/
        console.log(req.body); //其他参数
    }

});

app.listen(config.port, config.host, function () {
    console.log('Server start on ' + config.host + ':' + config.port);

    // // 定时器
    // setInterval(function () {
    //     upDataFile()
    // }, 3000000) // 检查一次，本地是否有修改，避免过多commit信息

    // // 提交
    // upDataFile()
    scheduleObjectLiteralSyntax()
});