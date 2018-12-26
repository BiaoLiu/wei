// pages/otherprize/otherprize.js
const baseUrl = 'https://www.popyelove.com/'
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myprize_list: [],
    page: 1,
    limit: 15
  },
  yichongzhi(e){
    var that=this
    console.log(e)
    if (e.target.dataset.id==""){
     return
    }
    wx.request({
      url: baseUrl + 'user/update/prize', //仅为示例，并非真实的接口地址
      data: {
        limit: that.data.limit,
        id: e.target.dataset.id
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
            title: '充值成功',
            icon: 'success',
            duration: 2000
          });
        }else{
          wx.showToast({
            title: '失败',
            icon: 'none',
            duration: 2000
          });
        }

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e)
    console.log(e.user_id)
    var that = this
    wx.request({
      url: baseUrl + 'user/user/prize', //仅为示例，并非真实的接口地址
      data: {
        limit: that.data.limit,
        user_id:e.user_id
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})