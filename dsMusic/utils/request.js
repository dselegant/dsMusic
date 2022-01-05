// 自定义请求
import config from "config.js"
let { host, mobileHost } = config;
let cookiesRegex = /MUSIC_U/;
export default (url, data = {}, method = "GET") => {
  return new Promise((resolve, rejected) => {
    wx.request({
      url: mobileHost+ url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync('cookies')
      },
      success: (res) => {
        // 在登录时设置cookie
        if (data.isLogin) {
          // 过滤出需要的cookie
          let cookies = res.cookies.filter((item, index) => {
            if (cookiesRegex.test(item)) {
              return true;
            }
          });
          wx.setStorageSync('cookies', cookies[0])
        }
        resolve(res.data);
      },
      fail: (err) => {
        rejected(err);
      }
    });
  });
}