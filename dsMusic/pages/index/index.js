// pages/index/index.js
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannersList:[],
    recommendList:[],
    rankList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 请求banner
    let bannnersListData = await request('/banner',{
      type:2
    });
    // 请求推荐歌单
    let recommendListData = await request('/personalized')
    // 请求排行榜数据
    let rankList = [];    
    for (let i = 0;i < 5;i++){
      let rankListData = await request('/top/list',{
        idx:i
      })
      rankList.push({
        name:rankListData.playlist.name, //排名榜名字
        musicList:rankListData.playlist.tracks.slice(0,3) //排名榜数据
      })
      this.setData({
        rankList
      })
    }
   //这样就是每次都添加一个排名榜，避免网络差没一次全加载出来空白 
    this.setData({
      bannersList:bannnersListData.banners,
      recommendList:recommendListData.result   
    })
  },
  toDrecommend(){
    wx.navigateTo({
      url: '/pages/dailyRecommend/dailyRecommend',
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