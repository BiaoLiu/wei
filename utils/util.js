const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}



const relogin=function relogin(){
  return new Promise(function (resolve, reject) {
            wx.login({
              success: res => {
                console.log(res)
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                  url: 'https://www.popyelove.com/auth/login', //仅为示例，并非真实的接口地址
                  data: {
                    code: res.code
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success:res=> {
                    var jsonstr = res.data
                    if (jsonstr.ret == 0) {
                      var Minipro_sessionid = jsonstr.data.Minipro_sessionid
                      wx.setStorageSync('Minipro_sessionid', Minipro_sessionid)
                      resolve(true)
                    }
                  }
                })
              }
            })
  })
}



module.exports = {
  formatTime: formatTime,
  relogin: relogin
}
