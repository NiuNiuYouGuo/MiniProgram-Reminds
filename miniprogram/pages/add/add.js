const db = wx.cloud.database()
const bwlCollection = db.collection('bwl')
let files
let nowdate
let nowtime
let images
Page({

  data: {
    files: [],
    inputDetailcursor:0
  },

  onLoad: function(options) {
    let timestamp = Date.parse(new Date());
    let n = timestamp//normal
    let m = timestamp + 15*60*1000//15minago
    let daten = new Date(n)
    let datem = new Date(m)
    let yn = daten.getFullYear()
    let mn = (daten.getMonth() < 10 ? '0' + (daten.getMonth() + 1) : daten.getMonth() + 1) //月份从0开始
    let dn = daten.getDate() < 10 ? '0' + daten.getDate() : daten.getDate()
    let hn = daten.getHours() < 10 ? '0' + daten.getHours() : daten.getHours()
    let minn = daten.getMinutes() < 10 ? '0' + daten.getMinutes() : daten.getMinutes()
    let ym = datem.getFullYear()
    let mm = (datem.getMonth() < 10 ? '0' + (datem.getMonth() + 1) : datem.getMonth() + 1) //月份从0开始
    let dm = datem.getDate() < 10 ? '0' + datem.getDate() : datem.getDate()
    let hm = datem.getHours() < 10 ? '0' + datem.getHours() : datem.getHours()
    let minm = datem.getMinutes() < 10 ? '0' + datem.getMinutes() : datem.getMinutes()
    nowdate = yn + '-' + mn + '-' + dn
    nowtime = hn + ':' + minn
    this.setData({
      date: ym + '-' + mm + '-' + dm,
      time: hm + ':' + minm
    })
  },

  onShareAppMessage: function() {

  },

  bindDateChange: function(event) {
    this.setData({
      date: event.detail.value
    })
  },

  bindTimeChange: function(event) {
    this.setData({
      time: event.detail.value
    })
  },

  chooseImage: function(event) {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        files = that.data.files.concat(res.tempFilePaths)
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        })
        console.log('文件个数' + files.length)
        console.log('文件路径' + res.tempFilePaths)
        let timestamp = Date.parse(new Date());
        let n = timestamp / 1000
        for (let i = 0; i < files.length; i++) {
          let cloudPath = 'photo/bwl/' + nowdate + '/' + 'bwlphoto' + '-' + n + '-' + i
          // console.log('CloudPath：' + cloudPath)
          // console.log('文件序列' + files[i])
          wx.cloud.uploadFile({
            cloudPath,
            filePath: files[i],
            success: function(res) {
              images = res.fileID
              console.log('images', images)

            },
            fail: function(res) {
              console.log('失败', res)
              wx.showToast({
                title: '失败',
                icon: 'none',
                duration: 1000
              })
            }
          })
        }
      }
    })
  },
  previewImage: function(event) {
    wx.previewImage({
      current: event.currentTarget.id,
      urls: this.data.files
    })
  },
  previewImagedelete: function (event) {
    let that = this
    wx.showModal({
      title: '是否清除所有图片',
      content: '图片一旦清除无法找回',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#808080',
      confirmText: '清除',
      confirmColor: '#da0000',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            files: []
          })
          wx.showToast({
            title: '清除成功',
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

  inputTitle: function(event) {
    this.setData({
      inputTitle: event.detail.value
    })
  },
  inputDetail: function(event) {
    this.setData({      
      inputDetailcursor:event.detail.cursor
    })
    let inputDetailcursor = event.detail.cursor
    if (inputDetailcursor<140){
      this.setData({
        inputDetail: event.detail.value,
      })
    }else{
      wx.showToast({
        title: '字数达到上限',
        icon: 'none',
        duration: 1500,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
      
  },
  isDoingSwitch: function(event) {
    this.setData({
      isDoingSwitch: event.detail.value
    })
  },
  add: function(event) {
    let inputTitle = this.data.inputTitle
    let inputDetail = this.data.inputDetail
    let isDoingSwitch = this.data.isDoingSwitch
    let date = this.data.date
    let time = this.data.time
    if (inputTitle) {
      if (inputDetail) {
          if (images){
            bwlCollection.add({
              data: {
                title: inputTitle,
                desc: inputDetail,
                isdoing: isDoingSwitch,
                isdone: false,
                count: 0,
                date: nowdate + ' ' + nowtime,                
                completeDate: date + ' ' + time,
                comdate:date,
                comtime:time,
                isdeleteing: false,
                alldelete:'alldelete',
                imagePath: [images]
              },
              success: res => {
                console.log('addfunction',res)
                wx.navigateTo({
                  url: '../index/index',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }
            })
          }else{
            bwlCollection.add({
              data: {
                title: inputTitle,
                desc: inputDetail,
                isdoing: isDoingSwitch,
                isdone: false,
                count: 0,
                date: nowdate + ' ' + nowtime,
                completeDate: date + ' ' + time,
                comdate: date,
                comtime: time,
                isdeleteing:false
              },
              success: res => {
                console.log(res)
                wx.navigateTo({
                  url: '../index/index',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }
            })
          }
      } else {
        wx.showToast({
          title: '内容为空',
          icon: 'none',
          duration:1000
        })
      }
    } else {
      wx.showToast({
        title: '标题为空',
        icon: 'none',
        duration:1000
      })
    }
  },
})