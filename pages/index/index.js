//index.js
//获取应用实例
const app = getApp()
const baseUrl ='https://www.popyelove.com/'
const qrcode ='http://pjd0p2xh1.bkt.clouddn.com/qrcode.jpg'
Page({
  data: {
    page:1,
    card_lists: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  addUser:function(e){
    if (e.hasOwnProperty("friendsessionid")){
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
  // 更改点赞状态
  onCollectionTap: function (event) {
    // 获取当前点击下标
    var index = event.currentTarget.dataset.index;
    // data中获取列表
    var message = this.data.card_lists;
    for (let i in message) { //遍历列表数据
      if (i == index) { //根据下标找到目标
        var collectStatus = false
        if (message[i].liked =='') { //如果是没点赞+1
          collectStatus = true
          message[i].liked=1
          message[i].like_count++
        } else {
          collectStatus = false
          message[i].liked = ''
          message[i].like_count--
        }
        wx.request({
          url: baseUrl + 'active/luck/join', //仅为示例，并非真实的接口地址
          data: {
            active_id: message[i].id,
            like: collectStatus?'1':'0'
          },
          method: 'POST',
          header: {
            'content-type': 'application/json', // 默认值
            'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
          },
          success: res => {
            wx.showToast({
              title: collectStatus ? '收藏成功' : '取消收藏',
            })
          }
        })

      }
    }
    this.setData({
      card_lists: message
    })
  }, 
  clickimg: function(e){
    var current = e.target.dataset.src
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: [current,qrcode] // 需要预览的图片http链接列表
    })
  },
  copy: function (e) {
    wx.setClipboardData({
      data: e.target.dataset.text,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },
  onLoad: function (res) {
    console.log(res)
    this.addUser(res)
    wx.request({
      url: baseUrl +'active/list', //仅为示例，并非真实的接口地址
      data: {
        code: ''
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
      },
      success: res => {
        console.log(res.data)
        if(res.data.ret==0){
          var cards = res.data.data
        }

        this.setData({
          card_lists: cards
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
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
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
  onShareAppMessage: function (res) {
    console.log(res)
    var minipro_sessionid = wx.getStorageSync('Minipro_sessionid')
    if (res.from=="button"){
      return {
        title: res.target.dataset.title,
        path: '/pages/index/index?friendsessionid=' + minipro_sessionid,
        imageUrl: res.target.dataset.imgsrc
      }
    } else if (res.from == "menu"){
      return {
        title: '分享给好友',
        path: '/pages/index/index?friendsessionid=' + minipro_sessionid
      }
    }


  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    wx.request({
      url: baseUrl + 'active/list', //仅为示例，并非真实的接口地址
      data: {
        code: ''
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
      },
      success: res => {
        console.log(res.data)
        if (res.data.ret == 0) {
          var cards = res.data.data
        }

        this.setData({
          card_lists: cards,
          page:1
        })
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    var page = this.data.page + 1;
    wx.request({
      url: baseUrl + 'active/list', //仅为示例，并非真实的接口地址
      data: {
        page:page
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
      },
      success: res => {
        var moment_list = that.data.card_lists
        if (res.data.ret == 0) {
          var cards = res.data.data
        }
        for (var i = 0; i < res.data.data.length; i++) {
          moment_list.push(res.data.data[i]);
        }
        this.setData({
          card_lists: that.data.card_lists,
          page:page
        })
// 隐藏加载框
        wx.hideLoading();
      }
    })
  },
  onShow: function () {
   this.onPullDownRefresh()
  },


})
