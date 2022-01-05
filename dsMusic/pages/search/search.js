import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索关键词
    defaultData: "",
    // 热搜榜数据
    hotSearchList: [],
    // 搜索数据
    searchList: [],
    // 搜索框数据
    inputValue: "",
    // 历史数据
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取初始化搜索关键词
    this.getDefault();
    // 获取热搜榜数据
    this.getHotMusicList();
    // 获取历史搜索记录
    let historyList = wx.getStorageSync('historyList');
    if (historyList.length) {
      this.setData({
        historyList
      })
    }
  },
  // 获取初始化搜索关键词方法
  async getDefault() {
    let ret = await request("/search/default")
    this.setData({
      defaultData: ret.data.showKeyword
    })
  },
  // 获取热搜榜数据
  async getHotMusicList() {
    let ret = await request("/search/hot/detail");
    this.setData({
      hotSearchList: ret.data
    })
  },
  // 输入事件回调
  inputChange(e) {
    // 输入的值
    let inputValue = e.detail.value.trim();
    // 防抖
    let timer = null;
    clearTimeout(timer);
    setTimeout(async () => {
      // 判断是否有值，再发送请求
      if (inputValue) {
        let ret = await request("/search",{keywords: inputValue, limit: 10});
        if (ret){
        this.historyList(inputValue);
        this.setData({
          // 搜索列表
          searchList: ret.result.songs
        });
        }
      }
    }, 300);
    this.setData({
      inputValue
    });
  },
  // 历史记录的存储
  historyList(value) {
    let historyList = this.data.historyList;
    // 记录是否存在
    let isExist = historyList.filter((item,index)=>{
      return value == item
    })
    if (isExist.length){
      return;
    }
    historyList.unshift(value);
    wx.setStorageSync('historyList', historyList)
    this.setData({
      historyList
    })
  },
  // 清空输入框
  deleteInput() {
    this.setData({
      inputValue: ""
    })
  },
  // 关闭搜索框
  closeSearch() {
    this.setData({
      inputValue: "",
      searchList: ""
    })
  },
  // 清空历史记录
  deleteSearchHistory() {
    wx.showModal({
      content: "是否删除历史记录?",
      success: (res) => {
        // 点击确定后
        if (res.confirm) {
          this.setData({
            historyList: []
          })
          // 移除本地的历史记录缓存
          wx.removeStorageSync('historyList');
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