import request from "../../utils/request.js"

// pages/personal/personal.js
let startY = 0;
let moveY = 0;
let offsetY = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    offsetY: 0,
    // 过度效果
    transition: "",
    userInfo:"",
    recentPlayList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取缓存用户信息
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo:JSON.parse(userInfo)
    })
    // 存储最近播放记录
    this.getRecent(this.data.userInfo.userId);
  },
  // 存储最近播放记录方法
  async getRecent(uid){
    let ret = await request('/user/record',{
      uid,
      type:0
    })
    this.setData({
      recentPlayList:ret.allData.slice(0,10)
    })
  },
  handTouchStart(e) {
    // 初始Y轴的值和初始化过渡效果
    startY = e.changedTouches[0].pageY;
    this.setData({
      transition: ""
    })
  },
  handTouchMove(e) {
    // 移动时Y轴的值
    moveY = e.changedTouches[0].pageY;
    offsetY = moveY - startY;
    if (offsetY >= 80) {
      offsetY = 80;
    }
    if (offsetY <= 0) {
      offsetY = 0;
    }
    this.setData({
      offsetY: offsetY + "rpx"
    })
  },
  handTouchEnd(e) {
  //设置手指松开时的偏移位移和过渡效果 
    this.setData({
      offsetY: "0rpx",
      transition:"transform linear .5s"
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