// pages/friends/friends.js
const baseUrl = 'https://www.popyelove.com/'
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    limit:15,
    friend_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.request({
      url: baseUrl + 'user/friends', //仅为示例，并非真实的接口地址
      data: {
      limit:that.data.limit
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
      },
      success: res => {
        console.log(res.data)
        if (res.data.ret == 0) {
          var friends = res.data.data
        } else if (res.data.ret==8001){
          var login_res=false
          utils.relogin().then(function(loginres){
            login_res = loginres
            console.log(login_res)
            if (login_res) {
              that.onLoad();
            }
          });

          
        }else{
          var friends = []
        }

        this.setData({
          friend_list: friends
        })
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
    wx.showNavigationBarLoading();
    var that = this
    wx.request({
      url: baseUrl + 'user/friends', //仅为示例，并非真实的接口地址
      data: {
       limit:that.data.limit
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
      },
      success: res => {
        console.log(res.data)
        if (res.data.ret == 0) {
          var friends = res.data.data
        } else if (res.data.ret == 8001) {
          var login_res = false
          utils.relogin().then(function (loginres) {
            login_res = loginres
            console.log(login_res)
            if (login_res) {
              that.onLoad();
            }
          });


        } else {
          var friends = []
        }

        this.setData({
          friend_list: friends,
          page: 1
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
      url: baseUrl + 'user/friends', //仅为示例，并非真实的接口地址
      data: {
        page: page,
        limit:that.data.limit
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
      },
      success: res => {
        var friend_list = that.data.friend_list
        if (res.data.ret == 0) {
          var friends = res.data.data
        } else if (res.data.ret == 8001) {
          var login_res = false
          utils.relogin().then(function (loginres) {
            login_res = loginres
            console.log(login_res)
            if (login_res) {
              that.onLoad();
            }
          });
        } else {
          var friends = []
        }
        for (var i = 0; i < res.data.data.length; i++) {
          friend_list.push(res.data.data[i]);
        }
        this.setData({
          friend_list: that.data.friend_list,
          page: page
        })
        // 隐藏加载框
        wx.hideLoading();
      }
    })
  }
})