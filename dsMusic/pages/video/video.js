// pages/video/video.js
import request from "../../utils/request.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 导航列表数据
    navList: [],
    // 导航索引
    navIndex: "",
    // 视频列表
    videoList: [],
    // 视频id
    vid: "",
    // 视频播放时长存储
    videoRecord: [],
    // 定义刷新状态
    isRefresh: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 执行获取导航列表函数
    this.getVideoNavList();
  },
  // 改变导航的索引
  changeNav(e) {
    // 在改变导航时显示正在加载提示框
    wx.showLoading({
      title: '加载中',
    })
    let id = e.currentTarget.id.split("").slice(2, 7).join('');
    this.setData({
      navIndex: id,
      // 再新视频数据出来前将视频清空
      videoList: ""
    })
    this.getVideoList(this.data.navIndex);
  },
  // 获取导航数据
  async getVideoNavList() {
    let ret = await request("/video/group/list")
    // console.log(ret);
    this.setData({
      navList: ret.data.slice(0, 14),
      navIndex: ret.data[0].id
    })
    // 获取视频
    this.getVideoList(this.data.navIndex);
  },
  // 获取视频方法
  async getVideoList(id) {
    let ret = await request("/video/group", {
      // 导航的id
      id
    })
    console.log(ret);
    // 获取完数据关闭加载提示框
    wx.hideLoading();
    this.setData({
      videoList: ret.datas
    })
  },
  // 用于转换图片和视频
  handPlay(e) {
    // 获取点击时传过来的vid
    let vid = e.currentTarget.id;
    // 创建控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid)
    let videoRecord = this.data.videoRecord;
    // 判断是否有视频记录
    let video = videoRecord.find((item) => {
      return vid == item.vid
    })
    if (video) {
      this.videoContext.seek(video.currentTime);
    }
    this.setData({
      vid
    })
  },
  // 存储视频播放记录
  timeUpdate(e) {
    let videoTimeObj = { vid: e.currentTarget.id, currentTime: e.detail.currentTime };
    let videoRecord = this.data.videoRecord;
    let videoItem = videoRecord.find(item => item.vid === videoTimeObj.vid);
    if (videoItem) { // 之前有
      videoItem.currentTime = e.detail.currentTime;
    } else { // 之前没有
      videoRecord.push(videoTimeObj);
    }
    // 更新videoUpdateTime的状态
    this.setData({
      videoRecord
    })
  },
  // 播放完后删除这条播放记录
  handEnd(e) {
    let vid = e.currentTarget.id;
    let videoRecord = this.data.videoRecord;
    // 找出要找删除的索引
    let endIndex = videoRecord.findIndex((item, index) => {
      return vid == item.vid
    })
    // 删除这条记录
    this.data.videoRecord.splice(endIndex, 1);
    this.setData({
      videoRecord
    })
  },
  // 刷新重新获取视频列表
  async refresh() {
    let id = this.data.navIndex;
    wx.showLoading({
      title: '刷新视频中',
    })
    let videoData = await request("/video/group", {
      // 导航的id
      id
    })
    let videoList = this.data.videoList;
    let oldVid = videoList[0].data.vid;
    let newVid = videoData.datas[0].data.vid;
    // 判断是否有数据
    if (oldVid == newVid) {
      setTimeout(() => {
        wx.showToast({
          title: '目前没有新的视频，请稍后再试',
          icon: "none"
        })
      }, 1000);
    } else {
      // 将数据添加
      wx.hideLoading();
      this.setData({
        videoList:videoData.datas
      })
    }
    this.setData({
      isRefresh: false
    })
  },
  // 触底添加新数据
  async handBottom() {
    let id = this.data.navIndex;
    wx.showLoading({
      title: '正在加载新的视频',
    })

    let videoData = await request("/video/group", {
      // 导航的id
      id
    })
    let videoList = this.data.videoList;
    let oldVid = videoList[0].data.vid;
    let newVid = videoData.datas[0].data.vid;
    // 判断是否有数据
    if (oldVid == newVid) {
      setTimeout(() => {
        wx.showToast({
          title: '目前没有新的视频，请稍后再试',
          icon: "none"
        })
      }, 1000);
    } else {
      // 将数据添加
      for (let i of videoData.datas) {
        videoList.push(i);
      }
      wx.hideLoading();
      this.setData({
        videoList
      })
    }
  },
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
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