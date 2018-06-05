/*
*
*Author: Fuxiaoke
*Create Time: 2018-04-08 10:58
*
*/

let pinyin = require('node-pinyin'),
    xlsx = require('node-xlsx').default,
    fs = require('fs');

const nameToPinyin = async (input,output) =>{
  let  workSheetsFromFile = xlsx.parse(input);
  let namePY=[],
    namepy='',
    data = [{
      name:'拼音情况',
      data:[['工号','姓名','拼音']]
    }],
    originData = workSheetsFromFile[0]['data'],
    str = '';
  for(let name in originData){
    if(name !=='0' && originData[name][2] !== undefined){
      str = originData[name][2];
      if(/^[\u3220-\uFA29]+$/.test(str)) {
        namePY = pinyin(str,{style:'normal'});
        namepy = namePY[0]+namePY[1][0].substring(0,1);
        ((namePY.length>2) && (namepy+=namePY[2][0].substring(0,1)));
        data[0].data.push([originData[name][1],originData[name][2],namepy+'@xiaopeng.com'])
      } else {
        data[0].data.push([originData[name][1],originData[name][2],originData[name][2]])
      }
    }
  }
  var buffer = xlsx.build(data);

  await fs.writeFile(output,buffer,err=>{
    if(err) {
      console.log(err);
      return err
    }

    console.log('success output name2pinyin');

    return output;
  });
};

module.exports = nameToPinyin;



