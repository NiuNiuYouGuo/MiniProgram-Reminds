const db = wx.cloud.database()
const bwlCollection = db.collection('bwl')
const _ = db.command
// pages/complete/complete.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    bwl: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    bwlCollection
      .where({
        isdone: true
      })
      .orderBy('_id', 'asc')
    .get().then(
      res => {
        this.setData({
          bwl: res.data
        })
        console.log(res)
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
    bwlCollection
      .where({
        isdone: true
      })
      .orderBy('_id', 'asc')
    .get().then(
      res => {
        this.setData({
          bwl: res.data
        })
        console.log("RefreshIng")
        wx.stopPullDownRefresh()
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.page + 20;
    bwlCollection.skip(page)
      .where({
        isdone: true
      })
      .orderBy('_id', 'asc')
    .get().then(res => {
      let new_data = res.data
      let old_data = this.data.bwl
      this.setData({
        bwl: old_data.concat(new_data),
        page: page
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  toinfo: function (event) {
    let id = event.currentTarget.dataset.id
    console.log(event)
    wx: wx.navigateTo({
      url: '../info/info?id=' + id,
    });
  },

  toindex: function (event) {
    console.log(event)
    wx: wx.navigateTo({
      url: '../index/index',
    })
  },
  todeleteorcomplete: function (event) {
    wx: wx.navigateTo({
      url: '../deleteorcomplete/deleteorcomplete',
    })
  },
  deleteitem: function (event) {
    console.log(event)
    let that = this
    wx.showModal({
      title: '是否删除',
      content: '删除记录，并且无法撤销',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#808080',
      confirmText: '删除',
      confirmColor: '#da0000',
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          let deleteid = event.currentTarget.dataset.id
          bwlCollection.doc(deleteid).remove({
            success(res) {
              bwlCollection
                .where({
                  isdone: false
                })
                .orderBy('isdoing', 'desc')
                .orderBy('_id', 'asc')
                .get()
                .then(
                  res => {
                    that.setData({
                      bwl: res.data
                    })
                  })
              wx.showToast({
                title: '删除完成',
                icon: 'none',
                duration: 1000
              });
            }
          })
        } else {
          wx.showToast({
            title: '取消',
            icon: 'none',
            duration: 1000
          });
        }
      }
    });
  },
  setnotcomplete: function (event) {
    let that = this
    let completeid = event.currentTarget.dataset.id
    bwlCollection.doc(completeid).update({
      data: {
        isdone: false
      },
      success(res) {
        bwlCollection
          .where({
            isdone: true
          })
          .orderBy('_id', 'asc')
          .get().then(
            res => {
              that.setData({
                bwl: res.data
              })
              console.log(res)
            })
        wx.showToast({
          title: '已设置未完成',
          icon: 'none',
          duration: 1000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
    console.log("completetouch", completeid)
  },
})