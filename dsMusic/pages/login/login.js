// pages/login/login.js
import request from "../../utils/request.js"
/**
  说明: 登录流程
  1. 收集表单项数据
  2. 前端验证
    1) 验证用户信息(账号，密码)是否合法
    2) 前端验证不通过就提示用户，不需要发请求给后端
    3) 前端验证通过了，发请求(携带账号, 密码)给服务器端
  3. 后端验证
    1) 验证用户是否存在
    2) 用户不存在直接返回，告诉前端用户不存在
    3) 用户存在需要验证密码是否正确
    4) 密码不正确返回给前端提示密码不正确
    5) 密码正确返回给前端数据，提示用户登录成功(会携带用户的相关信息)
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 监听输入，将数据写入到data中
  handInput(e) {
    // 输入的对象
    let type = e.currentTarget.id;
    // 对象里面的键值用对象要用[]
    this.setData({
      [type]: e.detail.value
    })
  },
  // 登录按钮
  async login() {
    let phone = this.data.phone
    let phoneRegex = /^1[3456789]\d{9}$/;
    let password = this.data.password;
    // 前端验证
    // 判断是否写入手机号
    if (phone == "") {
      wx.showToast({
        title: '请输入手机号码',
        icon: "none"
      })
      return;
    }
    // 判断手机号格式是否正确
    if (!phoneRegex.test(phone)) {
      wx.showToast({
        title: '手机号码格式错误，请重新填写'
      })
      return;
    }
    // 判断密码是否填写
    if (password == "") {
      wx.showToast({
        title: '密码未填写'
      })
      return;
    }
    // 后端验证
    // 正在加载
    wx.showLoading({
      title: '正在加载',
    });
    let user = await request('/login/cellphone', {
      phone,
      password,
      isLogin:true
    })
    wx.hideLoading();
    // 验证成功
    if (user.code == 200) {
      // 将用户信息存储到本地
      wx.setStorageSync('userInfo', JSON.stringify(user.profile));
      // 跳转
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
      return;
    }
    // 手机号码错误
    if (user.code == 501) {
      wx.showToast({
        title: '手机号错误，请重新填写',
        icon: "none"
      })
      return;
    }
    // 密码错误
    if (user.code == 502) {
      wx.showToast({
        title: '密码错误',
        icon: "error"
      })
      return;
    }

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