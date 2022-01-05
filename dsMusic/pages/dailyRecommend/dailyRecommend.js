// pages/dailyRecommend/dailyRecommend.js
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 日期
    date:{},
    // 推荐歌曲
    reMusic:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 这个页面要登录携带cookie
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo){
      wx.showToast({
        title: '请先登录',
        icon:"none",
        success:()=>{
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      })
    }
    // 获取日期
    let date = new Date();
    let month = date.getMonth();
    let day = date.getDate();
    this.setData({
      date:{
        month:month+1,
        day
      }
    })
    this.getReMusic();
  },
  // 获取推荐歌曲
  async getReMusic(){
    let ret = await request('/recommend/songs')
    // console.log(ret);
    this.setData({
      reMusic:ret.recommend
    })
  },
  // 跳转歌曲播放页
  toSong(e){
    let songId = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/song/song?songId='+songId,
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
    const pages = getCurrentPages() 
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