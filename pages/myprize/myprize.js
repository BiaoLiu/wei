// pages/myprize/myprize.js
const baseUrl = 'https://www.popyelove.com/'
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myprize_list:[],
    hiddenmodalput: true,
    getInput:'',
    prize_id:0,
    page:1,
    limit:15
  },
  getInput: function (e) {//方法1
    this.data.getInput = e.detail.value;
  },
  modalinput: function (e) {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      prize_id: e.target.dataset.prize_id
    })
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function () {
    var that =this
    var phone = that.data.getInput
    if(phone==''){
      wx.showToast({
        title: '请输入要充值的手机号',
        icon: 'none',
        duration: 2000
      });
      return
    }
    if (phone.length!=11){
      wx.showToast({
        title: '手机号格式有误',
        icon: 'none',
        duration: 2000
      });
      return
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(phone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    this.setData({
      hiddenmodalput: true
    })
    wx.request({
      url: baseUrl + 'user/use/prize', //仅为示例，并非真实的接口地址
      data: {
        phone:phone,
        prize_id:that.data.prize_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
      },
      success: res => {
        console.log(res.data)
        if (res.data.ret == 0) {
          wx.showToast({
            title: '24小时内到账',
            icon: 'success',
            duration: 2000
          });
        } else if (res.data.ret == 8001) {
          var login_res = false
          utils.relogin().then(function (loginres) {
            login_res = loginres
            console.log(login_res)
            if (login_res) {
              that.onLoad();
            }
          });
        }
        that.onLoad();
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: baseUrl + 'user/my/prize', //仅为示例，并非真实的接口地址
      data: {
        limit: that.data.limit
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
      },
      success: res => {
        console.log(res.data)
        if (res.data.ret == 0) {
          var myprize_list = res.data.data
        } else if (res.data.ret == 8001) {
          var login_res = false
          utils.relogin().then(function (loginres) {
            login_res = loginres
            console.log(login_res)
            if (login_res) {
              that.onLoad();
            }
          });
        }

        this.setData({
          myprize_list: myprize_list
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
    var that =this
    that.onLoad()
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
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
      url: baseUrl + 'user/my/prize', //仅为示例，并非真实的接口地址
      data: {
        page: page,
        limit: that.data.limit
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
      },
      success: res => {
        var myprize_list = that.data.myprize_list
        if (res.data.ret == 0) {
          var prizes = res.data.data
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
          var prizes = []
        }
        for (var i = 0; i < res.data.data.length; i++) {
          myprize_list.push(res.data.data[i]);
        }
        this.setData({
          myprize_list: that.data.myprize_list,
          page: page
        })
        // 隐藏加载框
        wx.hideLoading();
      }
    })
  }
})