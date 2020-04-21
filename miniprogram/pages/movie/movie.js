const db = wx.cloud.database();//初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList:[],
    content:"",//评价的内容
    score:2,//评分分数
    images:[],//上传图片
    fileIds:[],
  },

  //定义获取电影列表函数
  // getMovieList:function(){
  //   wx.showLoading({
  //     title: '正在加载中~',
  //   })
  //   wx.cloud.callFunction({
  //     name:'movielist',
  //     data:{
  //       start:this.data.movieList.length,
  //       count:10
  //     }
  //   }).then(res =>{
  //     console.log(JSON.parse(res.result).subjects)
  //     this.setData({
  //       movieList:this.data.movieList.concat(JSON.parse(res.result).subjects)
  //     }); 
  //     wx.hideLoading();
  //   }).catch(error =>{
  //     wx.hideLoading();
  //     console.log(error)
  //   })
  // },

  // 评价 
  onChange:function(event){
    this.setData({
      content: event.detail
    });
  },

  // 影评打分
  onScoreChange:function(event){
    this.setData({
      score: event.detail
    });
  },
  //上传图片
  uplodImg:function(){
    //选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed','original'],
      sourceType: ['album','camera'],
      success: res => {
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        this.setData({
          images:this.data.images.concat(tempFilePaths)
        })
      },
      fail: (res) => {},    
    })
  },
  // 提交数据
  submit:function(){
    wx.showLoading({
      title: '当前正在评论中',
    })

    console.log(this.data.content , this.data.score)
    
    // 上传图片到云存储
    let promiseArr = [];
    for(let i=0; i<this.data.images.length;i++){
      promiseArr.push(new Promise((reslovie,reject) =>{
        let item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0];//正则表达式，返回文件拓展名

        wx.cloud.uploadFile({
          cloudPath:new Date().getTime() + suffix,//上传至云端的路径
          filePath:item,//小程序临时文件路径
          success:res=>{
            // 返回文件ID
            console.log(res.fileID)
            this.setData({
              fileIds:this.data.fileIds.concat(res.fileID)
            });
            reslovie();
          },
          fail:console.error
        })
      }));
    }
    
    Promise.all(promiseArr).then(res =>{
      //插入数据
      db.collection('comment').add({
        data:{
          content:this.data.content,
          score:this.data.score,
          fileIds:this.data.fileIds
        }
      }).then(res =>{
        wx.hideLoading();
        wx.showToast({
          title: '评价成功',
        })
      }).catch(err =>{

      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getMovieList();
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
    this.getMovieList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})