const db = wx.cloud.database()
const bwlCollection = db.collection('bwl')
const _ = db.command
let sliderWidth = 96

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    bwl: [],
    tabs: ["全部", "打卡中", "未完成", "已完成"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.cloud.callFunction({
      name: 'deletecancel'
    })
    bwlCollection
      .field({
        title: true,
        desc: true,
        _id: true,
        isdone: true,
        isdoing: true,
        count: true,
        isdeleteing: true
      })
      .orderBy('isdoing', 'desc')
      .orderBy('_id', 'asc')
      .get()
      .then(
        res => {
          this.setData({
            bwl: res.data
          })
          console.log(res)
        })

    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function(event) {
    this.setData({
      sliderOffset: event.currentTarget.offsetLeft,
      activeIndex: event.currentTarget.id
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    bwlCollection
      .field({
        title: true,
        desc: true,
        _id: true,
        isdone: true,
        isdoing: true,
        count: true,
        isdeleteing: true
      })
      .orderBy('isdoing', 'desc')
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
  onReachBottom: function() {
    let page = this.data.page + 20;
    bwlCollection.skip(page)
      .field({
        title: true,
        desc: true,
        _id: true,
        isdone: true,
        isdoing: true,
        count: true,
        isdeleteing: true
      })
      .orderBy('isdoing', 'desc')
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
  onShareAppMessage: function() {

  },

  toinfo: function(event) {
    let id = event.currentTarget.dataset.id;
    console.log(event.currentTarget.dataset.id)
    wx: wx.navigateTo({
      url: '../info/info?id=' + id,
    });
  },

  tocomplete: function(event) {
    wx: wx.navigateTo({
      url: '../complete/complete',
    })
  },

  deleteitem: function(event) {
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
      success: function(res) {
        console.log(res);
        if (res.confirm) {
          let deleteid = event.currentTarget.dataset.id
          bwlCollection.doc(deleteid).remove({
            success(res) {
              bwlCollection
                .field({
                  title: true,
                  desc: true,
                  _id: true,
                  isdone: true,
                  isdoing: true,
                  count: true,
                  isdeleteing: true
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

  add: function(event) {
    wx: wx.navigateTo({
      url: '../add/add',
    })
  },

  todeleteorcomplete: function(event) {
    wx: wx.navigateTo({
      url: '../deleteorcomplete/deleteorcomplete',
    })
  },

  setdelete: function(event) {
    let that = this
    console.log('id', event.currentTarget.dataset.id)
    bwlCollection.doc(event.currentTarget.dataset.id).update({
      data: {
        isdeleteing: true
      },
      success(res) {
        console.log("标记为删除")
        bwlCollection
          .field({
            title: true,
            desc: true,
            _id: true,
            isdone: true,
            isdoing: true,
            count: true,
            isdeleteing: true
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
        console.log("标记成功")
      }
    })

  },
  setnotdelete: function(event) {
    let that = this
    console.log('id', event.currentTarget.dataset.id)
    bwlCollection.doc(event.currentTarget.dataset.id).update({
      data: {
        isdeleteing: false
      },
      success(res) {
        console.log("标记为不删")
        bwlCollection
          .field({
            title: true,
            desc: true,
            _id: true,
            isdone: true,
            isdoing: true,
            count: true,
            isdeleteing: true
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
        console.log("标记成功")
      }
    })
  },
  deleteall: function(event) {
    let that = this
    console.log("删除全部")
    wx.showModal({
      title: '是否删除',
      content: '将删除所有数据并且无法找回',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#808080',
      confirmText: '删除',
      confirmColor: '#da0000',
      success: function(res) {
        if (res.confirm) {
          wx.showModal({
            title: '删除所有数据',
            content: '一旦删除无法回复',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#808080',
            confirmText: '删除',
            confirmColor: '#da0000',
            success: function(res) {
              if (res.confirm) {
                wx.cloud.callFunction({
                  name: 'deleteall'
                })
                wx.showToast({
                  title: '删除完成',
                  icon: 'none',
                  duration: 1000
                })
                wx: wx.navigateTo({
                  url: '../deleteorcomplete/deleteorcomplete',
                })
              } else {
                wx.showToast({
                  title: '取消',
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '取消',
            icon: 'none',
            duration: 1000
          })
        }
      },
    })

  },
  deletedoing: function(event) {
    let that = this
    console.log("删除打卡")
    wx.showModal({
      title: '是否删除',
      content: '打卡项目将删除并且无法找回',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#808080',
      confirmText: '删除',
      confirmColor: '#da0000',
      success: function(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'deletedoing'
          })
          wx: wx.navigateTo({
            url: '../deleteorcomplete/deleteorcomplete',
          })
          wx.showToast({
            title: '删除完成',
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '取消',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  deletedone: function(event) {
    let that = this
    console.log("删除已完成")
    wx.showModal({
      title: '是否删除',
      content: '完成项目将删除并且无法找回',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#808080',
      confirmText: '删除',
      confirmColor: '#da0000',
      success: function(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'deletedone'
          })
          wx: wx.navigateTo({
            url: '../deleteorcomplete/deleteorcomplete',
          })
          wx.showToast({
            title: '删除完成',
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '取消',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  deletenotdone: function(event) {
    let that = this
    console.log("删除未完成")
    wx.showModal({
      title: '是否删除',
      content: '未完成项目将删除并且无法找回',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#808080',
      confirmText: '删除',
      confirmColor: '#da0000',
      success: function(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'deletenotdone'
          })
          wx: wx.navigateTo({
            url: '../deleteorcomplete/deleteorcomplete',
          })
          wx.showToast({
            title: '删除完成',
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '取消',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  deleteselect: function(event) {
    let that = this
    console.log("删除选中")
    wx.showModal({
      title: '是否删除',
      content: '选中将删除并且无法找回',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#808080',
      confirmText: '删除',
      confirmColor: '#da0000',
      success: function(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'deletedoing'
          }).then(success=>{
            bwlCollection
              .orderBy('isdoing', 'desc')
              .orderBy('_id', 'asc')
              .get()
              .then(
                res => {
                  console.log(res)
                  that.setData({
                    bwl: res.data
                  })
                  console.log("删除选中：更新查询")
                })
          })
          
          wx.showToast({
            title: '删除完成',
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '取消',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  deletecancel: function(event) {
    let that = this
    console.log("取消选中")
    wx.cloud.callFunction({
      name: 'deletecancel'
    })
    wx: wx.navigateTo({
      url: '../deleteorcomplete/deleteorcomplete',
    })
  },
})