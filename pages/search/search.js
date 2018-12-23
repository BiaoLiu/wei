// pages/search/search.js
const app = getApp()
const baseUrl = 'https://www.popyelove.com/'
const qrcode = 'http://pjd0p2xh1.bkt.clouddn.com/qrcode.jpg'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    card_lists: [],
    inputValue: '', //搜索的内容
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
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
        if (message[i].liked == '') { //如果是没点赞+1
          collectStatus = true
          message[i].liked = 1
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
            like: collectStatus ? '1' : '0'
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
  clickimg: function (e) {
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
  //搜索框文本内容显示
  inputBind: function (event) {
    this.setData({
      inputValue: event.detail.value
    })
    console.log('bindInput' + this.data.inputValue)

  },
  query: function (event) {
    var that = this
    var keyword = that.data.inputValue
    if(keyword!=""){
      wx.request({
        url: baseUrl + 'active/list',
        data: {
          keyword: that.data.inputValue
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
          if(cards.length!==0){

            this.setData({
              card_lists: cards
            })
          }else{
            wx.showToast({
              title: '没有相关数据',
              icon: 'success',
              duration: 2000
            })
          }

        }
      })
    }else{
      this.setData({
        card_lists: []
      })
      wx.showToast({
        title: '请输入关键字',
        icon: 'success',
        duration: 2000
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    } else {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var word = this.data.inputValue
    if (word!=""){
      wx.showNavigationBarLoading();
      wx.request({
        url: baseUrl + 'active/list',
        data: {
          keyword: this.data.inputValue
        },
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
          'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
        },
        success: res => {
          if (res.data.ret == 0) {
            var cards = res.data.data
          }
          this.setData({
            card_lists: cards,
            page: 1
          })
          // 隐藏导航栏加载框
          wx.hideNavigationBarLoading();
          // 停止下拉动作
          wx.stopPullDownRefresh();
        }
      })
    }else{
      this.setData({
        card_lists: []
      })
      wx.showToast({
        title: '请输入关键字',
        icon: 'success',
        duration: 2000
      })
    }

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
        page: page,
        keyword: this.data.inputValue
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
          page: page
        })
        // 隐藏加载框
        wx.hideLoading();
      }
    })
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
        path: '/pages/index/index?friendsessionid=' + minipro_sessionid,
        imageUrl: res.target.dataset.imgsrc
      }
    } else if (res.from == "menu") {
      return {
        title: '分享给好友',
        path: '/pages/index/index?friendsessionid=' + minipro_sessionid
      }
    }


  },
})