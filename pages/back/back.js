// pages/back/back.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],//临时图片地址
    count: 0,
    upImgUrl: 'https://www.popyelove.com/user/miniupload',
    context:''
  },
  uploadimg:function(data) {
    console.log(data)
    var that = this;
    wx.showLoading({
      title: '上传中...',
    })
    wx.uploadFile({
      url: data.url, //开发者服务器 url
      filePath: data.path[0],
      name: 'image',
      header: {
        'Minipro-sessionid': wx.getStorageSync("Minipro_sessionid")
      },
      formData: {
        'context': data.context
      },
      success: res => {
        // 隐藏加载框
        wx.hideLoading();
        that.setData({
          context: '',
          count: 0,
          images: []

        })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      },
    })

  },
  textinputfun:function(e){
    console.log(e)
    if (e.type =="blur"){
      if(e.detail.value!=""){
        var that = this;
        console.log(e.detail.value)
        that.setData({
          context: e.detail.value
        })
      }
    }
  },
  chooseImage: function () {
    var that = this;
    if (that.data.count>0){
      return
    }
    wx.chooseImage({ 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths
        that.setData({
          images: that.data.images.concat(tempFilePaths),
          count:1
        })
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  },
  uploadImg: function (e) {
    var that = this;
    console.log(that.data)
    if (that.data.images.length > 0) {
      that.uploadimg({
        url: that.data.upImgUrl,
        path: that.data.images,
        context:that.data.context
      });
    } else {
      console.log("没有可上传的文件");
    }
  }
})