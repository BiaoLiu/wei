/// 很简单的一个小程序游戏大转盘抽奖实现思路
/// 通过后台调取API接口，获取用户抽奖权限，如获得的抽奖次数（luckDrawCount），奖品数据
/// 然后调取相应的API接口抽奖，抽奖结果返回，开启转盘动画，将转盘的rotateZ转到已经设置好奖项的位置
/// 弹出modal显示抽奖结果
/// （理论支撑微信小程序和支付宝小程序,只需做些许修改）
const baseUrl = 'https://www.popyelove.com/'
var utils = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    userInfo: {},
    gameAnimation: null, //转盘动画
    gameState: false,   // 游戏状态
    gameModal: false,   // 模态框控制状态
    luckDrawCount: 3,  //  抽奖次数
    gameModalData: {},  //  奖品modal显示的数据（抽奖结果数据）
    rotateZPositionCount: 0, // 当前转盘的rotateZ 值
    preUseRotateZ: 0,           // 上一次已抽奖中奖奖品的RotateZ
    yourscore:0,
    scoreOneTime:5,
    rotateZPositionIndex:4,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  addUser: function (e) {
    console.log(e)
    if (e.hasOwnProperty("friendsessionid")) {
      wx.request({
        url: baseUrl + 'user/addfriend', //仅为示例，并非真实的接口地址
        data: {
          friend_sessionid: e.friendsessionid
        },
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
          'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
        },
        success: res => {
          console.log(res)
        }
      })
    }

  },
  onLoad(e) {
    var that = this
    wx.request({
      url: baseUrl + 'game/drawcount', //仅为示例，并非真实的接口地址
      data: {
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
      },
      success: res => {
        console.log(res.data)
        if (res.data.ret == 0) {
          var drawcount = res.data.data.count
          var yscore = res.data.data.score
        } else if (res.data.ret == 8001) {
          var login_res = false
          utils.relogin().then(function (loginres) {
            login_res = loginres
            if (login_res) {
              that.onLoad(e);
            }
          });
        }
        that.addUser(e)
        this.setData({
          luckDrawCount:3-drawcount,
          yourscore: yscore
        })
      }
    })


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }


  },
  getUserInfo: function (e) {
    console.log(e)
    if(e.detail.userInfo){
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }else{
      return
    }
    wx.request({
      url: baseUrl + 'user/register', //仅为示例，并非真实的接口地址
      data: {
        user_nickname: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl,
        sex: e.detail.userInfo.gender,
        country: e.detail.userInfo.country,
        province: e.detail.userInfo.province,
        city: e.detail.userInfo.city

      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Minipro-sessionid': wx.getStorageSync('Minipro_sessionid')
      },
      success: res => {
        console.log(res.data)
      }
    })
  },
  // 点击立即使用按钮
  actionBtn(){
    wx.navigateTo({
      url: '/pages/myprize/myprize'
    })
    this.closeModal(); // 关闭模态框
  },
  // 关闭模态框
  closeModal(){
    this.setData({
      gameModal: false
    })
  },
  // 打开模态框
  showModal(){
    this.setData({
      gameModal: true
    })
  },
  // 奖品设置 传入一个奖项，0，1，2，3，4， 分别是12345等奖
  prizeData(grade){
    const prize = [
      // 一等奖 || 免单
      {
        title: '手气不错哟～恭喜获得',         // 奖品辩题
        prize: '10元话费卷',                      // 中奖内容
        prize_type:'0',
        invalid_date: '请在30天内使用' // 失效日期
      },
      // 二等奖 || 9.5折优惠券
      {
        title: '手气不错哟～恭喜获得',         // 奖品辩题
        prize: '5元话费卷',               // 中奖内容
        prize_type: '1',
        invalid_date: '请在30天内使用' // 失效日期
      },
      // 三等奖 || 免服务费
      {
        title: '手气不错哟～恭喜获得',        // 奖品辩题
        prize_type: '2',
        prize: '5积分奖励'                  // 中奖内容
      },
      // 四等奖 || 10元代金券
      {
        title: '手气不错哟～恭喜获得',         // 奖品辩题
        prize_type: '3',
        prize: '2积分奖励'                // 中奖内容
      },
      // 五等奖 || 5元代金券
      {
        title: '手气不错哟～恭喜获得',        // 奖品辩题
        prize_type: '4',
        prize: '1积分奖励'                 // 中奖内容
      },
    ];
    return prize[grade]; // 返回奖品数据
  },
  // 开始游戏
  gameAction(){
    var that = this
    // 判断游戏是否进行中
    if (this.data.gameState) return;
    that.setData({
      gameState: true
    })
    // 判断是否还有抽奖资格
    if (this.data.luckDrawCount <= 0) {
      wx.showToast({
        title: 'Sorry 您没有抽奖机会了',
        icon: 'none',
        duration: 2000
      });
      that.setData({
        gameState: false
      })
      return;
    }
    if (this.data.yourscore < this.data.scoreOneTime) {
      wx.showToast({
        title: 'Sorry,你的积分不足',
        icon: 'none',
        duration: 2000
      });
      that.setData({
        gameState: false
      })
      return;
    }
    wx.request({
      url: baseUrl + 'user/drawluck', //仅为示例，并非真实的接口地址
      data: {
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
      },
      success: res => {
        if (res.statusCode!=200){
          wx.showToast({
            title: '网络异常,请稍候重试。',
            icon: 'none',
            duration: 2000
          });
          that.setData({
            gameState: false
          })
          return false;
        }
        if (res.data.ret == 0) {
          var prizeindex = res.data.data
        } else if (res.data.ret == 8001) {
          var login_res = false
          utils.relogin().then(function (loginres) {
            login_res = loginres
            if (login_res) {
              that.onLoad();
            }
          });
          wx.showToast({
            title: '网络异常,请稍候重试。',
            icon: 'none',
            duration: 2000
          });
          return false;
        }else{
          var title =res.data.msg;
          wx.showToast({
            title: title,
            icon: 'none',
            duration: 2000
          });
          that.setData({
            gameState: false
          })
          return;
        }
        this.setData({
          rotateZPositionIndex:prizeindex,
        })
        // 模拟抽奖
        var rotateZPositionIndex = this.data.rotateZPositionIndex
        this.gameAnimationRun(rotateZPositionIndex);
      }

    })


  },
  // 游戏实现部分
  gameAnimationRun(rotateZPositionIndex){

    // 奖品指针位置20 一等奖，290二等奖，200，三等奖， 110 四等奖，68 五等奖，
    // 计算归着，每次抽奖最终rotateZ值 + 相应的奖品值位置 = (rotateZCount + rotateZPosition[0]) 等于一等奖
    var rotateZPosition = [20, 290, 200, 110, 68];

    var rotateZ = 360;     // 一圈360deg
    var rotateZCount = 10; // 旋转圈数的倍数
    /// 转盘位置计算规则 一圈360deg 乘以 10圈，加上 奖品 rotateZ值，再减去上一次中奖rotateZ值
    var toRotateZCount = (this.data.rotateZPositionCount - this.data.preUseRotateZ + rotateZPosition[rotateZPositionIndex]) + rotateZ * rotateZCount; // 达到圈数位置

    var animation = wx.createAnimation({ // 动画实例
      duration: 5000, // 动画持续5秒
      delay: 10,
      timeFunction: 'ease', // 由慢-加快-降速停止
    });
    animation.rotateZ(toRotateZCount).step();
    this.setData({
      gameAnimation: animation.export()
    })

    // 设置状态
    setTimeout(_=>{
      this.showModal();   // 当转盘停止显示模态框显示抽奖结果
      this.setData({ 
        preUseRotateZ: rotateZPosition[rotateZPositionIndex], // 上一次奖品
        rotateZPositionCount: toRotateZCount,              // 记录当前转盘rotateZ 值
        luckDrawCount: this.data.luckDrawCount-1,          // 抽奖次数减一
        yourscore: this.data.yourscore - this.data.scoreOneTime,
        gameState: false,                                   // 将转盘状态切换为可抽奖
        gameModalData: this.prizeData(rotateZPositionIndex) // 设置奖品数据
      })
    }, 5000)
  },

  onShow: function () {
    this.onPullDownRefresh()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(res)
    var minipro_sessionid = wx.getStorageSync('Minipro_sessionid')
    if (res.from == "button") {
      return {
        title: res.target.dataset.title,
        path: '/pages/game/game?friendsessionid=' + minipro_sessionid,
        imageUrl: res.target.dataset.imgsrc
      }
    } else if (res.from == "menu") {
      return {
        title: '分享给好友',
        path: '/pages/game/game?friendsessionid=' + minipro_sessionid
      }
    }


  },
  /**
* 页面相关事件处理函数--监听用户下拉动作
*/
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    wx.request({
      url: baseUrl + 'game/drawcount', //仅为示例，并非真实的接口地址
      data: {
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
      },
      success: res => {
        console.log(res.data)
        if (res.data.ret == 0) {
          var drawcount = res.data.data.count
          var yscore = res.data.data.score
        } else if (res.data.ret == 8001) {
          var login_res = false
          utils.relogin().then(function (loginres) {
            login_res = loginres
            if (login_res) {
              that.onLoad();
            }
          });
        }
        this.setData({
          luckDrawCount: 3 - drawcount,
          yourscore: yscore
        })
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  }
});
