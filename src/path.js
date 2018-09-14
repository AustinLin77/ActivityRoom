var  path={
  url:"http://172.30.128.37:8080/swdAPP/common/activity/",
  title:"gongsi",
  get:function a () {
    return this.url;
  },
  seturl:function b(url) {
    this.url = url;
    console.log(this.url)
  },

};
export default path
