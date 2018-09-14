<template>
  <div >
    <div class="top">
      <mu-tabs :value="activeTab" @change="handleTabChange" >
        <mu-tab value=0 title="未完成"/>
        <mu-tab value=1 title="已签到"/>
        <mu-tab value=2 title="已取消"/>
        <mu-tab value=3 title="已爽约"/>
      </mu-tabs>
    </div>
    <mu-dialog :open="yourDialog" title="温馨提示">
      当前时间不是预约时段，暂时无法进行预约，请稍后再试!
      <mu-flat-button label="确定" slot="actions" primary @click="yourClose"/>
    </mu-dialog>
    <mu-dialog :open="qDialog" title="温馨提示">
      您所选择的预约时间不是本活动室的开放时间,请重新选择时间预约!
      <mu-flat-button label="确定" slot="actions" primary @click="qClose"/>
    </mu-dialog>
    <mu-dialog :open="dialog" title="提示" @close="close">
      您确定要取消预约?
      <mu-flat-button slot="actions" @click="close" primary label="取消"/>
      <mu-flat-button slot="actions" primary @click="closeRefresh" label="确定"/>
    </mu-dialog>
    <order-details-c ref="children" :flag="myFlag" v-on:myRewrite="showBox" v-on:myDelete="myCancel" style="position: absolute;top:50px;left: 0;width: 100%;overflow-y: scroll;height: 100%;padding-bottom: 50px"></order-details-c>
    <div>

    </div>
    <div v-show="flagO" class="help">
      <div v-show="flagO" class="try">
        <div class="outer">
          <div class="starter">厂区 : </div>
          <div class="ender">{{areaName}}<span style="margin-left: 50px"> {{roomName}}</span></div>
        </div>
        <div class="outer">
          <div class="starter">预约人 : </div>
          <div class="ender">{{userName}}</div>
        </div>
        <div class="outer">
          <div class="starter">预约日期 : </div>
          <div class="ender">
            <el-select v-model="signDate" placeholder="请选择预约日期" style="width: 100%" @change="myGetDay">
              <el-option
                v-for="item in dateData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="outer">
          <div class="starter">预约时段 : </div>
          <div class="enderO">
            <el-select v-model="startTime" placeholder="开始时段" style="flex: 5" @change="myGetEnd">
              <el-option
                v-for="item in startData"
                :key="item"
                :value="item">
              </el-option>
            </el-select>
            <span style="flex: 1;text-align: center">--</span>
            <el-select v-model="endTime" placeholder="结束时段" style="flex: 5">
              <el-option
                v-for="item in finalEndData"
                :key="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="myButton">
          <el-button type="primary" style="width: 80px" @click="rewrite">保存</el-button>
          <el-button type="primary" style="width: 80px" @click="quxiao">取消</el-button>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import orderDetailsC from './MyOrderDetails.vue'
  export default {
    data() {
      return {
        qDialog: false,
        yourDialog: false,
        openTime: [],
        orderStart: '',
        orderEnd: '',
        activeTab: '0',
        myFlag: 0,
        flagO: false,
        dateData: [],
        startData: [],
        endData: [],
        signDate: '',
        startTime: '',
        endTime: '',
        userName: '',
        areaName: '',
        bookId: '',
        roomId: '',
        roomName: '',
        currentDate: '',
        flag: 0,
        selectDay: '',
        usingTimeStartList: [],
        usingTimeEndList: [],
        usingTimeWeekStartList: [],
        usingTimeWeekEndList: [],
        finalEndData: [],
        usingTimeList: [],
        usingTimeWeekList: [],
        ifWeek: false,
        notEnd: [],
        notEndWeek: [],
        isCut: 1,
        checked: false,
        nowDate: '',
        testData: [],
        testDataWeek: [],
        dialog: false
      }
    },
    components: {
      orderDetailsC
    },
    created() {

    },
    mounted() {
      let vm = this;
      console.log(this.pathpar.url);
    },
    methods: {
      yourClose() {
        this.yourDialog = false;
      },
      qClose() {
        this.qDialog = false;
        this.signDate = ''
      },
      close() {
        this.dialog = false
      },
      closeRefresh() {
        let vm = this;
        $.ajax({
          url: vm.pathpar.url + 'setBespeakStatus.json',
          dataType: "json",
          data: {
            bookId: vm.bookId,
            token: localStorage.getItem("token"),
            status: 2
          },
          type: "post",
          success: function (res) {
            console.log(res);
            if (res.message == '操作成功') {
              vm.$message({
                type: 'success',
                message: '删除成功!'
              });
              vm.dialog = false
              vm.$refs.children.getData(0, 8);
            }
          },
          error: function () {
          }
        });
      },
      quxiao() {
        this.flagO = false
      },
      myCancel(opt) {
        this.bookId = opt.bookId;
        this.dialog = true;
//        this.$confirm('您确定要取消预约?', '提示', {
//          confirmButtonText: '确定',
//          cancelButtonText: '取消',
//          type: 'warning'
//        }).then(() => {
//          let vm = this;
//          $.ajax({
//            url: vm.pathpar.url+ + 'setBespeakStatus.json',
//            dataType: "json",
//            data: {
//              bookId: vm.bookId,
//              token: vm.token,
//              status: 2
//            },
//            type: "post",
//            success: function (res) {
//              console.log(res);
//              if (res.message == '操作成功') {
//                vm.$message({
//                  type: 'success',
//                  message: '删除成功!'
//                });
//                vm.$refs.children.getData(0,8);
//              }
//            },
//            error: function () {
//            }
//          });
//        }).catch(() => {
//          this.$message({
//            type: 'info',
//            message: '已取消删除'
//          });
//        });
      },
      dataHandler(res) {
        res.extData.notStart = [];
        res.extData.notStartWeek = [];
//        res.extData.notEnd=[];
//        res.extData.notEndWeek=[];
        res.extData.usingTimeList = [];
        res.extData.usingTimeWeekList = [];
        res.extData.testData = res.extData.roomInfo.usingTime.split(";");
        if (res.extData.roomInfo.usingTimeWeek) {
          res.extData.testDataWeek = res.extData.roomInfo.usingTimeWeek.split(";");
          res.extData.testDataWeek = res.extData.testDataWeek.filter(item => item !== '');
          for (var b = 0; b < res.extData.testDataWeek.length; b++) {
            res.extData.testDataWeek[b] = res.extData.testDataWeek[b].split(",")
          }
          for (let item of res.extData.testDataWeek) {
            res.extData.notStartWeek.push(item[item.length - 1])
          }
          for (let item of res.extData.testDataWeek) {
            this.notEndWeek.push(item[0])
            console.log(this.notEndWeek)
          }
          for (var d = 0; d < res.extData.testData.length; d++) {
            res.extData.usingTimeWeekList = res.extData.usingTimeWeekList.concat(res.extData.testDataWeek[d])
          }
        }


        res.extData.testData = res.extData.testData.filter(item => item !== '');

        for (var i = 0; i < res.extData.testData.length; i++) {
          res.extData.testData[i] = res.extData.testData[i].split(",")
        }

        for (let item of res.extData.testData) {
          res.extData.notStart.push(item[item.length - 1])
        }

        for (let item of res.extData.testData) {
          this.notEnd.push(item[0])
        }

        for (var c = 0; c < res.extData.testData.length; c++) {
          res.extData.usingTimeList = res.extData.usingTimeList.concat(res.extData.testData[c])
        }

        this.usingTimeList = res.extData.usingTimeList;
        this.usingTimeWeekList = res.extData.usingTimeWeekList;
        this.notStart = res.extData.notStart;
        this.notStartWeek = res.extData.notStartWeek;
        this.testData = res.extData.testData;
        this.testDataWeek = res.extData.testDataWeek;
        this.usingTimeStartList = this.arrayDiff(res.extData.notStart, res.extData.usingTimeList);
//        this.usingTimeEndList = this.arrayDiff(res.extData.notEnd, res.extData.usingTimeList);
        this.usingTimeWeekStartList = this.arrayDiff(res.extData.notStartWeek, res.extData.usingTimeWeekList);
//        this.usingTimeWeekEndList = this.arrayDiff(res.extData.notEndWeek, res.extData.usingTimeWeekList);
      },
      arrayDiff(shortA, longA) {
        let arr = [];
        for (var i = 0; i < longA.length; i++) {
          if (shortA.indexOf(longA[i]) == -1) {
            arr.push(longA[i]);
          }
        }
        return arr
      },
      myGetEnd() {
        this.endTime = '';
        if (this.isCut == 1) {
          console.log(this.notEnd)
          var finalEnd = [];
          var middleData = [];
          console.log(this.endData)
          console.log(this.startTime)
          console.log(this.ifWeek)
          if (this.ifWeek) {
            console.log(this.testDataWeek)
            for (var i = 0; i < this.testDataWeek.length; i++) {
              for (var t = 0; t < this.testDataWeek[i].length; t++) {
                if (this.testDataWeek[i][t].indexOf(this.startTime) != -1) {
                  middleData.push(this.testDataWeek[i])
                  console.log(middleData)
                }
              }
            }
            for (var i = 0; i < middleData.length; i++) {
              if (middleData[i] == this.startTime) {
                for (var t = i + 1; t < middleData.length; t++) {
                  finalEnd.push(middleData[t]);
                  console.log(finalEnd)
                  this.finalEndData = this.arrayDiff(this.notEndWeek, finalEnd);
                }
              }
            }
          } else {
            console.log(this.testData)
            for (var i = 0; i < this.testData.length; i++) {
              for (var t = 0; t < this.testData[i].length; t++) {
                if (this.testData[i][t].indexOf(this.startTime) != -1) {
                  console.log("aaa")
                  middleData.push(this.testData[i])

                  console.log(middleData)
                }
              }
            }
            for (var i = 0; i < middleData[0].length; i++) {
              console.log(middleData)
              console.log(this.startTime)
              if (middleData[0][i] == this.startTime) {
                console.log("aaa")
                for (var t = i + 1; t < middleData[0].length; t++) {
                  finalEnd.push(middleData[0][t]);
                  console.log(finalEnd)
                  this.finalEndData = this.arrayDiff(this.notEnd, finalEnd);
                }
              }
            }
          }
        } else {
          this.finalEndData = [];
          if (!this.ifWeek) {
            for (var w = 0; w < this.startData.length; w++) {
              if (this.startTime == this.startData[w]) {
                this.finalEndData.push(this.notStart[w])
              }
            }
          } else {
            for (var w = 0; w < this.startData.length; w++) {
              if (this.startTime == this.startData[w]) {
                this.finalEndData.push(this.notStartWeek[w])
              }
            }
          }

        }
      },
      myGetDay() {
        var date = new Date(this.signDate.replace('-', '/'));
        this.selectDay = date.getDay();
        if (this.selectDay < 6) {
          this.startData = this.usingTimeStartList;
          this.endData = this.testData;
          this.ifWeek = false
        } else if (this.selectDay >= 6) {
          this.startData = this.usingTimeWeekStartList;
          this.endData = this.testDataWeek;
          this.ifWeek = true
        }
      },
      getOpenDate(res) {
        var date = new Date();
        this.getMyDate(date);
        if (res.extData.roomInfo.beforeOrder == 1) {
          var nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
          this.getMyDate(nextDate)
        }
      },
      getMyDate(date) {
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        this.currentDate = year + seperator1 + month + seperator1 + strDate;
        console.log(this.currentDate);
        this.dateData.push({"value": this.currentDate})
//            this.dateData[this.flag].label=this.currentDate;
//            this.flag++
      },
      getCanSign(res) {
        var canSignTime = res.extData.roomInfo.orderTime.split(",");
        var seperator1 = "-";
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentDate = year + seperator1 + month + seperator1 + strDate;
        this.orderStart = new Date(currentDate + " " + canSignTime[0]).getTime();
        this.orderEnd = new Date(currentDate + " " + canSignTime[1]).getTime();
      },
      getRoomData() {
        let vm = this;
        $.ajax({
          url: vm.pathpar.url +'findActivityRoom.json',
          dataType: "json",
          data: {
            roomId: vm.roomId,
            token: localStorage.getItem("token")
          },
          type: "get",
          success: function (res) {
            console.log(res);
            if (res.extData.roomInfo.isCut == 0) {
              vm.isCut = 0
            }
            vm.openTime = res.extData.roomInfo.openTime.split(",");
            vm.getCanSign(res);
            vm.getOpenDate(res);
            vm.dataHandler(res)
          },
          error: function () {
          }
        });
      },
      handleTabChange(val) {
        this.activeTab = val;
        this.myFlag = val;
        console.log(this.myFlag)
      },
      showBox(opt) {
        this.signDate = '';
        this.startTime = '';
        this.endTime = '';
        this.dateData = [];
        this.flagO = true;
        console.log(opt);
        let vm = this;
        this.userName = opt.userName;
        this.areaName = opt.areaName;
        this.bookId = opt.bookId;
        this.roomId = opt.roomId;
        this.roomName = opt.roomName;
        this.getRoomData()
//        vm.$router.push({
//          name: 'myRewrite',
//          params: {
//            bookId:opt.bookId,
//            roomId:opt.roomId,
//            roomName:opt.roomName,
//            userName:opt.userName,
//            areaName:opt.areaName
//          }
//        })
      },
      rewrite() {

        console.log(this.orderStart)
        console.log(this.orderEnd)
        console.log(this.selectDay.toString())
        console.log(this.openTime)
        var userSignTime = new Date().getTime();
        console.log(userSignTime)
        if (this.orderStart > userSignTime || this.orderEnd < userSignTime) {
          this.yourDialog = true
        } else {
          if (this.openTime.indexOf(this.selectDay.toString()) == -1) {
            this.qDialog = true
          } else {
            var seperator1 = "-";
            var date=new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
              month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
            }
            this.nowDate = year + seperator1 + month + seperator1 + strDate;
            console.log(this.nowDate);
            if(this.signDate==this.nowDate){
              var signTime=this.signDate+' '+this.startTime;
              console.log(signTime)
              var reg = new RegExp( '-' , "g" )
              signTime = signTime.replace(reg,'/');
              console.log(signTime)
              var signTimeC=new Date(signTime).getTime()
              console.log(signTimeC)
              var nowTimeC=new Date().getTime()
              console.log(nowTimeC)
              if(nowTimeC>signTimeC){
                var str='您所选择的时间不符合预约规则(当前时间已大于您的预约开始时间),请重新选择预约时间。'
                this.$message({
                  message:str,
                });
                this.startTime='';
                this.endTime=''
              }else{
                let vm = this;
                $.ajax({
                  url: vm.pathpar.url+'updateActivityBook.json',
                  dataType: "json",
                  data: {
                    roomId: vm.roomId,
                    bookId: vm.bookId,
                    token: localStorage.getItem("token"),
                    dateTime: vm.signDate,
                    startTime: vm.startTime,
                    endTime: vm.endTime
                  },
                  type: "post",
                  success: function (res) {
                    console.log(res);
                    if(res.message=='操作成功'){
                      vm.flagO = false;
                      vm.$message("修改成功！")
                      vm.$refs.children.getData(0,8);
                    }else{
                      vm.$message('预约失败,请重新预约')
                    }

                  },
                  error: function () {
                  }
                });
              }
            }else{
              let vm = this;
              $.ajax({
                url: vm.pathpar.url+'updateActivityBook.json',
                dataType: "json",
                data: {
                  roomId: vm.roomId,
                  bookId: vm.bookId,
                  token: localStorage.getItem("token"),
                  dateTime: vm.signDate,
                  startTime: vm.startTime,
                  endTime: vm.endTime
                },
                type: "post",
                success: function (res) {
                  console.log(res);
                  if(res.message=='操作成功'){
                    vm.flagO = false;
                    vm.$message("修改成功！")
                    vm.$refs.children.getData(0,8);
                  }else{
                    vm.$message('预约失败,请重新预约')
                  }

                },
                error: function () {
                }
              });
            }
          }
        }
      }
    }
  }
</script>
<style scoped>
  .background{
    position: absolute;
    top:0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: #eeeeee;
  }
  .top{
    width: 100%;
    position: absolute;
    top:0;
    left: 0;
    height: 50px;
  }
  .help{
    position:absolute;
    top: 50px;
    left:0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: rgba(0, 0, 0, 0.7);
  }
  .try{
    position: fixed;
    height: 300px;
    width: 92%;
    z-index: 9999;
    background-color: white;
    opacity:1;
    top:20%;
    left: 4%;
    -webkit-animation:lefteaseinAnimate 1s ;
  }
  @-webkit-keyframes lefteaseinAnimate {
    0% {
      left:-1000px;
      top:20%;

    }
    100% {
      left:4%;
      top:20%;

    }
  }
  .outer{
    height: 50px;
    padding: 10px 10px 10px 10px;
    display: flex;
    align-items: center;
  }
  .starter{
    width: 80px;
    font-size: 16px;
    color: #4682B4;
  }
  .ender{
    flex:1;
    padding-left: 5px;
    font-size: 16px;
    color: darkgrey;
  }
  .enderO{
    flex:1;
    padding-left: 5px;
    font-size: 16px;
    color: darkgrey;
    display: flex;
  }
  .myButton{
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
