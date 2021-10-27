'use strict';

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
});