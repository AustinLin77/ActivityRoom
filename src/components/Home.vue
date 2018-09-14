<template>
  <div style="overflow-y: hidden">
    <div style="position: absolute;top: 0;left: 0;width: 100%;height: 100px">
      <div class="myOrder">
        <div  class="myButton" @click="goMyOrder">我的预约</div>
      </div>
      <div class="area">
        <span style="font-size: 15px">厂区 : </span>
        <el-select v-model="value" placeholder="请选择" style="width: 112px" @change="getValueList">
          <el-option
            v-for="item in options"
            :key="item.AREA_NAME"
            :label="item.AREA_NAME"
            :value="item.AREA_ID">
          </el-option>
        </el-select>
      </div>
    </div>

    <div style="background-color: #eeeeee;position: absolute;top: 100px;left: 0;overflow: scroll;width: 100%;padding-bottom: 100px;height: 100%">
      <div class="roomList" @click="orderList(item)" v-for="item in roomList">
        <div class="firstD">
          {{item.roomName}}
        </div>
        <div class="secondD">
          <span style="color: darkgrey;">上限人数 : </span>
          <span style="color: black;margin-left: 10px">{{item.personNum}}人</span>
        </div>
        <div class="secondD" style="display: flex">
          <span style="color: darkgrey;flex: 1">开放时间 : </span>
          <span style="color: black;font-size: 12px;flex: 3;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.myOpenTime}}</span>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
export default {
  data () {
    return {
      options: [],
      value: 1,
      time:'8:30-12:00,14:00-17:30,18:30-21:30',
      roomList:[],
      myArea:'',

    }
  },
  created(){

  },
  mounted(){
    let vm=this;
    localStorage.setItem("token",this.$route.query.token);
    console.log(localStorage.getItem("token"));
    if(localStorage.getItem("token").substr(0,3)=='wx_'){
      this.pathpar.seturl('http://172.30.128.37:8080/swdAPP/weixin/activity/')
      console.log(this.pathpar.url);
    }
    this.getAreas();
    this.getActivityRoomList()

  },
  methods:{
    getValueList(){
      let vm=this;
      for(var i=0;i<vm.options.length;i++){
        if(vm.value===vm.options[i].AREA_ID){
          vm.myArea=vm.options[i].AREA_NAME;
          console.log(vm.myArea)
        }
      }
      $.ajax({
        url: vm.pathpar.url+'findActivityRoomList.json',
        dataType: "json",
        data: {
          areaId:vm.value,
          token:localStorage.getItem("token")
        },
        type: "get",
        success: function (res) {
          console.log(res);
          vm.handleData(res);
        },
        error: function () {
        }
      });
    },
    getAreas(){
      let vm=this;
      $.ajax({
        url: vm.pathpar.url+'findActivityFactoryList.json',
        dataType: "json",
        data: {
        },
        type: "get",
        success: function (res) {
          console.log(res);
          vm.options=res.dataInfo.listData
          console.log(vm.options)
        },
        error: function () {
        }
      });
    },
    getActivityRoomList(){
      let vm=this;
      $.ajax({
        url: vm.pathpar.url+'findActivityRoomList.json',
        dataType: "json",
        data: {
          areaId:1,
          token:localStorage.getItem("token")
        },
        type: "get",
        success: function (res) {
          console.log(res);
          vm.roomList=res.dataInfo.listData;
          for(var i=0;i<res.dataInfo.listData.length;i++){
            res.dataInfo.listData[i].textData=res.dataInfo.listData[i].usingTime.split(";");
          }

        },
        error: function () {
        }
      });
    },
    goMyOrder(){
      let vm=this;
      vm.$router.push('/myOrder')
      console.log(vm.value)
    },
    orderList(item){
      const vm=this;
      vm.$router.push({
          name: 'orderList',
          params: {
            roomId:item.roomId,
            roomName:item.roomName,
            userName:item.userName,
            areaName:vm.myArea
          }
        })
    },
    handleData(res){
      let vm =this;
      for(var i=0;i<res.dataInfo.listData.length;i++){
//        if(!res.dataInfo.listData[i].usingTime){
//          res.dataInfo.listData[i].usingTime="16:30,17:30;18:30,19:30;20:30,21:30"
//          res.dataInfo.listData[i].usingTimeWeek="8:30,10:00;10:30,12:00;14:00,16:00;16:30,17:30;18:30,20:00;20:30,22:00"
//        }
        res.dataInfo.listData[i].textData=res.dataInfo.listData[i].usingTime.split(";");
        if(res.dataInfo.listData[i].isCut==0){
          res.dataInfo.listData[i].myOpenTime='';
          for(var c=0;c<res.dataInfo.listData[i].textData.length;c++){
            res.dataInfo.listData[i].textData[c]=res.dataInfo.listData[i].textData[c].replace(',','--');
            res.dataInfo.listData[i].textData[c]+='  ';
            res.dataInfo.listData[i].myOpenTime+=res.dataInfo.listData[i].textData[c]
          }
        }else{
          for(var d=0;d<res.dataInfo.listData[i].textData.length;d++){
            if(res.dataInfo.listData[i].textData[d]){
              res.dataInfo.listData[i].myTestStart=res.dataInfo.listData[i].textData[d].split(",")[0];
              break
            }
          }
          res.dataInfo.listData[i].myTestEnd=res.dataInfo.listData[i].textData[res.dataInfo.listData[i].textData.length-1].split(",")[res.dataInfo.listData[i].textData[res.dataInfo.listData[i].textData.length-1].split(",").length-1]
          res.dataInfo.listData[i].myOpenTime=res.dataInfo.listData[i].myTestStart+'--'+res.dataInfo.listData[i].myTestEnd
        }

      }
      vm.roomList=res.dataInfo.listData;
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .myOrder{
    width: 100%;
    height: 40px;
    background-color:#4682B4 ;
    position: relative;
  }
  .myButton{
    position: absolute;
    right: 10px;
    top: 10px;
    color: white;
    font-size: 14px;
    height: 20px;
  }
  .area{
    height: 60px;
    background-color: #eeeeee;
    line-height: 60px;
    padding-left: 15px;
  }
  .roomList{
    width: 100%;
    height: 90px;
    background-color: white;
    margin: 0 0 10px 0 ;
  }
  .firstD{
    width: 100%;
    height: 30px;
    display: flex;
    align-items: flex-end;
    padding-left: 18px;
    font-size: 16px;
    color: #4682B4;
  }
  .secondD{
    /*width: 100%;*/
    height: 30px;
    line-height: 30px;
    padding-left: 25px;
    font-size: 15px;
    padding-right: 10px;
  }

</style>
