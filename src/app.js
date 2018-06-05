let express = require('express'),
    app = express(),
    multer  = require('multer'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs');

let upload = multer({ dest: path.join(__dirname,'public' )});

let nameToPinyin = require('./api/pinyin');

app.use(express.static(path.join(__dirname,'views')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let name2mailPath = 'download/pinyin/name2mail.xlsx';

app.post('/eapi/upload/excel/name2mail',upload.single('file'),(req,res)=>{
  console.log(req.file,nameToPinyin);
  let outputPath = path.join(__dirname,name2mailPath);
  nameToPinyin(req.file.path,outputPath)
    .then(()=>{
      res.send({
        code:2000,
        result:'/eapi/download/excel/name2mail'
      })
    });
});

app.get('/eapi/download/excel/name2mail',(req,res)=>{
  res.download(name2mailPath);
  fs.readdir(path.join(__dirname,'public'),(err,files)=>{
    if(err) console.log(err);
    files.map(item=>{
      fs.unlink(path.join(__dirname+'/public/',item),uerr=>{
        if(uerr) console.log(uerr);
        console.log('删除'+item+'成功')
      })
    })
  })
});

console.log('listen 8086');
app.listen(8086);