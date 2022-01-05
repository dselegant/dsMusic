// pages/song/song.js
import request from "../../utils/request.js"
import moment from "moment"
// 获取全局app.js对象
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 播放状态
    isPlay: false,
    // 歌曲id
    songId: "",
    // 歌曲详细
    songsDetail: {},
    // 音乐链接
    musicUrl: '',
    // 歌曲总时长
    musicDuration: "",
    // "歌曲播放进度"
    currentTime:"00:00",
    // "进度条长度"
    barWidth:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // console.log(options);
    // 创建全局唯一音乐控制器
    this.BackgroundAudioManager = wx.getBackgroundAudioManager();

    // 获取音乐详情
    await this.getMusicDetail(options.songId);
    // 进入后自动播放
    await this.musicControl(true, options.songId)
    // 判断音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId == options.songId) {
      this.setData({
        isPlay: true
      });
    };
    // 监听系统音乐播放
    this.BackgroundAudioManager.onPlay(() => {
      this.changePlay(true);
      appInstance.globalData.musicId = options.songId;
    });
    // 监听系统音乐暂停
    this.BackgroundAudioManager.onPause(() => {
      this.changePlay(false);
    });
    // 监听音乐关闭
    this.BackgroundAudioManager.onStop(() => {
      this.changePlay(false);
    });
    this.setData({
      songId: options.songId
    })
    // 监听音乐播放进度
    this.BackgroundAudioManager.onTimeUpdate(()=>{
      // 格式化当前时间
      let currentTime = moment(this.BackgroundAudioManager.currentTime*1000).format("mm:ss");
      // 计算出进度条长度
      let barWidth = this.BackgroundAudioManager.currentTime*1000/this.data.songsDetail.dt*450;
      this.setData({
        currentTime,
        barWidth
      })
    })
  },
  // 根据系统播放状态控制小程序内的播放状态
  changePlay(isPlay) {
    this.setData({
      isPlay
    })
    // 设置全局播放状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  // 播放/暂停状态控制
  musicPlay() {
    let isPlay = !this.data.isPlay;
    let id = this.data.songId;
    this.musicControl(isPlay, id)
    this.setData({
      isPlay
    })
  },
  // 获取音乐详细
  async getMusicDetail(ids) {
    let ret = await request('/song/detail', {
      ids
    });
    console.log(ret);
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: ret.songs[0].name,
    })
    this.setData({
      songsDetail: ret.songs[0],
      musicDuration: moment(ret.songs[0].dt).format("mm:ss")
    })
  },
  // 控制音乐播放暂停功能
  async musicControl(isPlay, id) {
    let name = this.data.songsDetail.name;
    let url = this.data.musicUrl;
    if (!url) {
      let ret = await request("/song/url", {
        id
      })
      console.log(ret);
      this.setData({
        musicUrl: ret.data[0].url
      })
    }
    // 判断是否在播放
    if (isPlay) {
      this.BackgroundAudioManager.src = this.data.musicUrl;
      this.BackgroundAudioManager.title = name;
    } else {
      this.BackgroundAudioManager.pause();
    }
  },
  // 切换歌曲
  toggleMusic(e) {
    let songId = this.data.songId;
    // 关闭当前播放的音乐
    this.BackgroundAudioManager.stop();
    // 获取页面站=栈
    const pages = getCurrentPages();
    // console.log(pages);
    // 获取歌曲列表
    let musicList = pages[0].data.reMusic;
    // 找到当前歌曲索引
    let musicIndex = musicList.findIndex((item, index) => {
      return songId == item.id
    })
    let type = e.currentTarget.id;
    if (type == "next") {
      musicIndex++;
      if (musicIndex >= musicList.length) {
        musicIndex = 0;
      }
      this.toggleInfo(musicList, musicIndex);
    } else {
      musicIndex--;
      if (musicIndex < 0) {
        musicIndex = musicList.length - 1;
      }
      this.toggleInfo(musicList, musicIndex);
    }
  },
  // 切换歌曲信息
  async toggleInfo(musicList, musicIndex) {
    let songId = musicList[musicIndex].id;
    this.setData({
      // 为songId赋值
      songId,
      // 将歌曲链接清空
      musicUrl: ""
    })
    // 获取歌曲详细
    await this.getMusicDetail(songId);
    // 获取歌曲
    await this.musicControl(true, songId);
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