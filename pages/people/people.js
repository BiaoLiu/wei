// pages/people/people.js
const baseUrl = 'https://www.popyelove.com/'
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuitems: [
      [{ text: '电话', url: '', tips: '', bindtap: 'navTo' }],
      [{ text: '积分记录', url: '', tips: '', bindtap: 'navTo' }, { text: '我的奖品', url: '', tips: '', bindtap: 'navTo' }],
      [{ text: '积分获取规则', url: '', tips: '', bindtap: 'showRule' }, { text: '联系客服', url: '', tips: '', bindtap: 'makePhone' }],
      ],
    firend_count:0,
    like_count:0,
    user_id:0,
    your_score:0,
  },
  makePhone() {
    wx.showModal({
      title: '联系客服',
      content: '17620352758',
      confirmText: '拨打',
      success: res => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '17620352758'
          })
        }
      }
    })
  },
  navTo(){

  },
  showRule() {
    wx.showModal({
      title: '积分获取规则',
      content: '1:通过个人中心签到获取；\r\n2：分享首页内容获取',
      showCancel: false
    })
  },
  signUp: function(){
    var that = this
    wx.request({
      url: baseUrl + 'user/signup', //仅为示例，并非真实的接口地址
      data: {
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
      },
      success: res => {
        if (res.data.ret == 0) {
          wx.showToast({
            title: '签到成功',
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
        } else if (res.data.ret == 8022){
          wx.showToast({
            title: '今天已经签过到了',
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
  onLoad: function (options) {
    var that=this
    wx.request({
      url: baseUrl + 'user/info', //仅为示例，并非真实的接口地址
      data: {
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
      },
      success: res => {
       if (res.data.ret==0){
         var userinfo=res.data.data
         this.setData({
           firend_count: userinfo.friend_count,
           like_count: userinfo.like_count,
           user_id:userinfo.id,
           your_score:userinfo.score,
         })
       }else if(res.data.ret==8001){
         var login_res = false
         utils.relogin().then(function (loginres) {
           login_res = loginres
           console.log(login_res)
           if (login_res) {
             that.onLoad();
           }
         });
       }

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
    this.onLoad();
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