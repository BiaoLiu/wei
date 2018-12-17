// pages/people/people.js
const baseUrl = 'https://www.popyelove.com/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    firend_count:0,
    like_count:0,
    user_id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
           user_id:userinfo.id
         })
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