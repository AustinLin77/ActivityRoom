<template>
    <div>
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
              v-for="item in endData"
              :key="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
              dateData: [],
              startData:[],
              endData:[],
              signDate: '',
              startTime:'',
              endTime:'',
              userName:'',
              areaName:'',
              bookId:'',
              roomId:'',
              roomName:'',
              currentDate:'',
              flag:0,
              selectDay:'',
              usingTimeStartList:[],
              usingTimeEndList:[],
              usingTimeWeekStartList:[],
              usingTimeWeekEndList:[],
            }
        },
        created() {

        },
        mounted() {
          this.userName=this.$route.params.userName;
          this.areaName=this.$route.params.areaName;
          this.bookId=this.$route.params.bookId;
          this.roomId=this.$route.params.roomId;
          this.roomName=this.$route.params.roomName;
          this.getRoomData()
        },
        methods: {
          dataHandler(res){
            res.extData.notStart=[];
            res.extData.notStartWeek=[];
            res.extData.notEnd=[];
            res.extData.notEndWeek=[];
            res.extData.usingTimeList=[];
            res.extData.usingTimeWeekList=[];
            res.extData.testData=res.extData.usingTime.split(";");
            res.extData.testDataWeek=res.extData.usingTimeWeek.split(";");
            res.extData.testData=res.extData.testData.filter(item => item!=='');
            res.extData.testDataWeek=res.extData.testDataWeek.filter(item => item!=='');
            for(var i=0;i< res.extData.testData.length;i++){
              res.extData.testData[i]=res.extData.testData[i].split(",")
            }
            for(var b=0;b< res.extData.testDataWeek.length;b++){
              res.extData.testDataWeek[b]=res.extData.testDataWeek[b].split(",")
            }
            for(let item of res.extData.testData){
              res.extData.notStart.push(item[item.length-1])
            }
            for(let item of res.extData.testDataWeek){
              res.extData.notStartWeek.push(item[item.length-1])
            }
            for(let item of res.extData.testData){
              res.extData.notEnd.push(item[0])
            }
            for(let item of res.extData.testDataWeek){
              res.extData.notEndWeek.push(item[0])
            }
            for(var c=0;c< res.extData.testData.length;c++){
              res.extData.usingTimeList=res.extData.usingTimeList.concat(res.extData.testData[c])
            }
            for(var d=0;d< res.extData.testData.length;d++){
              res.extData.usingTimeWeekList=res.extData.usingTimeWeekList.concat(res.extData.testDataWeek[d])
            }
            this.usingTimeStartList = this.arrayDiff(res.extData.notStart, res.extData.usingTimeList);
            this.usingTimeEndList = this.arrayDiff(res.extData.notEnd, res.extData.usingTimeList);
            this.usingTimeWeekStartList = this.arrayDiff(res.extData.notStartWeek, res.extData.usingTimeWeekList);
            this.usingTimeWeekEndList = this.arrayDiff(res.extData.notEndWeek, res.extData.usingTimeWeekList);
          },
          arrayDiff(shortA,longA){
            let arr = [];
            for(var i=0;i<longA.length;i++){
              if(shortA.indexOf(longA[i])==-1 ){
                arr.push(longA[i]);
              }
            }
            return arr
          },
          myGetEnd(){
            for(var i=0;i<this.endData.length;i++){
              if(this.endData[i]===this.startTime){
                for(var t=0;t<=i;t++){
                  this.endData.splice(this.endData[t],1)
                }
              }
            }
          },
          myGetDay(){
            var date = new Date(this.signDate.replace('-', '/'));
            this.selectDay = date.getDay();
            if(this.selectDay<6){
              this.startData=this.usingTimeStartList;
              this.endData=this.usingTimeEndList;
            }else if(this.selectDay>=6){
              this.startData=this.usingTimeWeekStartList;
              this.endData=this.usingTimeWeekEndList;
            }
          },
          getOpenDate(res){
            var date = new Date();
            this.getMyDate(date);
            if(res.extData.beforeOrder == 1){
              var nextDate = new Date(date.getTime() + 24*60*60*1000);
              this.getMyDate(nextDate)
            }
          },
          getMyDate(date){
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
            this.dateData.push({"value":this.currentDate})
//            this.dateData[this.flag].label=this.currentDate;
//            this.flag++
          },
          getRoomData(){
            let vm = this;
            $.ajax({
              url: vm.path+'findActivityRoom.json',
              dataType: "json",
              data: {
                roomId:vm.roomId
              },
              type: "get",
              success: function (res) {
                console.log(res);
                vm.getOpenDate(res);
                vm.dataHandler(res)
              },
              error: function () {
              }
            });
          }
        }

    }
</script>
<style scoped>
  .outer{
    height: 50px;
    padding: 10px 15px 10px 15px;
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

</style>

