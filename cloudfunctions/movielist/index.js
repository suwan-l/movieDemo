// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 引入request-promise包
var rp = require('request-promise')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

   // 这里用的是ES6的模板字符串
  return rp(`https://douban.uieee.com/v2/movie/in_theaters?start=${event.start}&count=${event.count}`)
    .then(function(res){
      console.log(res)
      return res;
    })
    .catch(function(err){
      console.err(err)
    });
}