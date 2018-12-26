// pages/shangchuan/shangchuan.js
const baseUrl = 'https://www.popyelove.com/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    card_lists: [],
    user_id:'0'
  },
  shenhetongguo(e){
    wx.request({
      url: baseUrl + 'active/access', //仅为示例，并非真实的接口地址
      data: {
        active_id: e.target.dataset.active_id,
        user_id: e.target.dataset.user_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
      },
      success: res => {
        if (res.data.ret == 0) {
          wx.showToast({
            title: '审核通过',
            icon: 'success',
            duration: 2000
          });
          this.onLoad()
        }
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var user_id=this.data.user_id
    if(user_id=='0'){
      user_id=e.user_id
    }
    wx.request({
      url: baseUrl + 'active/user/list', //仅为示例，并非真实的接口地址
      data: {
        user_id: user_id
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
          user_id:user_id
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