<template>
  <div class="lgklgk">
    <mu-dialog :open="myDialog" title="温馨提示">
      您还不是瑜伽室会员,无法预约瑜伽室。如有需要,请联系管理员申请瑜伽室会员。
      <mu-flat-button label="确定" slot="actions" primary @click="myClose"/>
    </mu-dialog>
    <mu-dialog :open="yourDialog" title="温馨提示">
      当前时间不是预约时段，暂时无法进行预约，请稍后再试!
      <mu-flat-button label="确定" slot="actions" primary @click="yourClose"/>
    </mu-dialog>
    <mu-dialog :open="qDialog" title="温馨提示">
      您所选择的预约时间不是本活动室的开放时间,请重新选择时间预约!
      <mu-flat-button label="确定" slot="actions" primary @click="qClose"/>
    </mu-dialog>
    <div class="outer">
      <div class="starter">厂区 : </div>
      <div class="ender">{{areaName}}<span style="margin-left: 30px"> {{roomName}}</span></div>
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
    <div class="outer">
      <div class="starter" style="width: 100px">已预约人数 : </div>
      <div class="ender">{{signNum}}人</div>
    </div>
    <div class="read">
      <el-checkbox v-model="checked"></el-checkbox>
      我阅读了并同意
      <a @click="openMessage">
        《欣旺达活动室规章制度》
      </a>
    </div>
    <div class="footB">
      <el-button type="primary" style="width: 80px" @click="getAccess">预约</el-button>
    </div>
  </div>
</template>

<script>
  import ruldata from './rulesData.js'
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
        qDialog:false,
        areaName:'',
        bookId:'',
        roomId:'',
        roomName:'',
        currentDate:'',
        flag:0,
        yourDialog:false,
        selectDay:'',
        usingTimeStartList:[],
        usingTimeEndList:[],
        usingTimeWeekStartList:[],
        usingTimeWeekEndList:[],
        finalEndData:[],
        usingTimeList:[],
        usingTimeWeekList:[],
        ifWeek:false,
        notStart:[],
        notStartWeek:[],
        notEnd:[],
        notEndWeek:[],
        isCut:1,
        checked: false,
        nowDate:'',
        testData:[],
        testDataWeek:[],
        strGuangming :'',
        signNum:0,
        myDialog:false,
        openTime:[],
        orderStart:'',
        orderEnd:'',
//        '<div class="stitle">目的：为丰富员工的业余生活，营造良好的生活环境，促进公司企业文化落地，保证广大员工及家属文明、有序地使用员工活动室各项设施设备，特制订此管理规定。</div>\n' +
//        '<div class="stitle">适用范围：公司全体在职员工及进入活动室游玩的家属</div>\n' +
//        '<div class="stitle">活动地点：光明厂区外租宿舍张生楼一楼欣旺达员工活动室</div>\n' +
//        '<div class="stitle">活动室功能：健身房、乒乓球场区、儿童娱乐区、成人阅览区、儿童阅览区、电视区、休闲区、瑜伽房、管理处</div>\n' +
//        '<div class="xstitle">开放时间：非工作日：17:30-21:30</div>\n' +
//        '<div class="stitle">1、员工及家属进入健身房、瑜伽房、乒乓球场区、儿童娱乐区、儿童阅览区、成人阅览区，需提前在欣旺达APP平台进行预约，预约成功后方可进入，未预约人员谢绝入内；\n' +
//        '</div>\n' +
//        '<div class="stitle">具体以欣旺达APP开放的预约时间为准</div>\n' +
//        '<div class="xstitle">入场规定：</div>\n' +
//        '<div class="stitle">2、预约成功的员工请自觉携带厂牌，于管理员处出示预约号领取门禁卡；</div>\n' +
//        '<div class="stitle">3、员工及家属进入电视区、休闲区无需提前预约；</div>\n' +
//        '<div class="stitle">4、儿童进入儿童娱乐区（仅限3-12岁、身高120cm以下儿童）、儿童阅览区时，需成人全程陪同；儿童禁止进入健身房、乒乓球场区、成人阅览区。如有不服从管理规定、擅自违规进入上述区域导致自己或他人儿童受到伤害的，需自行承担相应责任；</div>\n' +
//        '<div class="xstitle">预约操作指引：</div>\n' +
//        '<div class="stitle">1、员工本人：登录欣旺达APP— 光明活动室预约— 选择日期、时间— 确认；</div>\n' +
//        '<div class="stitle">2、员工家属：提前在管理员处备案登记，办理家属活动室卡（详见家属活动室卡办理细则），管理员将家属信息关联至员工本人，统一由员工本人进行预约；</div>\n' +
//        '<div class="stitle">3、员工可提前三日进行预约（时间：8:00-21:00），按照最大容纳人数，约满即止；</div>\n' +
//        '<div class="stitle">5、员工若未及时取消而爽约三次，系统将自动记入黑名单，三个月内不能再次进行预约。</div>\n' +
//        '<div class="xstitle">活动室管理措施：</div>\n' +
//        '<div class="stitle">1、活动室管理部门为行政安全中心-行政组；</div>\n' +
//        '<div class="stitle">2、活动室管理员主要负责预约登记办理、门禁卡管理、视频监控管理、家属活动室卡资料审核及办理、日常设备设施维护，活动室现场管理等工作；</div>\n' +
//        '<div class="stitle">3、管理员严格管理活动室物品，每日闭馆后进行物品清点及设备维护，发现物品丢失或损坏，及时查明原因；</div>\n' +
//        '<div class="stitle">4、预订后如需修改或取消，请在预约进场前的30分钟进行修改/取消操作；</div>\n' +
//        '<div class="xstitle">家属活动室卡办理细则</div>\n' +
//        '<div class="stitle">申办对象：欣旺达在职员工家属（配偶、子女）</div>\n' +
//        '<div class="xstitle">办卡流程须知：</div>\n' +
//        '<div class="stitle">一、新办活动卡</div>\n' +
//        '<div class="stitle">在职员工持家属身份证复印件1份、1寸照片1张、家属证明复印件1张（户口本、结婚证、出生证），至活动室管理处签订《欣旺达家属活动卡协议》进行办理。</div>\n' +
//        '<div class="stitle">二、挂失与补办活动卡</div>\n' +
//        '<div class="stitle">1、活动卡丢失应及时持本人有效证件至活动室管理处办理挂失手续；</div>\n' +
//        '<div class="stitle">2、填写《补卡申请单》交至活动室管理处进行办理。</div>\n' +
//        '<div class="stitle">三、退卡</div>\n' +
//        '<div class="stitle">1、因离职需办理家属退卡，请持《离职申请单》至活动室管理处办理注销手续；</div>\n' +
//        '<div class="stitle">2、员工因工作调动或休假等原因需办理退卡，请持《岗位调动申请单》至活动室管理处办理注销手续。</div>\n' +
//        '<div class="stitle">四、违章处罚</div>\n' +
//        '<div class="stitle">家属活动卡仅限家属本人使用，不得转借他人。借用或者冒用他人活动卡者，一经发现则扣留活动卡，记录在案，并按公司奖惩管理规定对在职职工进行相应处罚。</div>\n' +
//        '<div class="stitle">五、办卡地点</div>\n' +
//        '<div class="stitle">外租宿舍张生楼一楼活动室管理处</div>\n' +
//        '<div class="stitle">六、办卡时间</div>\n' +
//        '<div class="stitle">周一至周五 17:30-21:30</div>\n' +
//        '<div class="xstitle">健身房管理细则</div>\n' +
//        '<div class="stitle">适用范围：公司在职员工及员工家属（0-14周岁的儿童禁止入内)限定人数：30人</div>\n' +
//        '<div class="xstitle">管理规定：</div>\n' +
//        '<div class="stitle">1、健身房为我司员工业余时间健身锻炼的场所，只对公司在职员工及家属开放，进入活动室请自觉佩戴厂牌，家属出示欣旺达活动卡，禁止一切不明人员入内，自觉遵守活动室管理规定；</div>\n' +
//        '<div class="stitle">2、使用每一种器械之前，请先阅读使用说明和安全注意事项，使用前检查健身器械，确认各部分连接件是否牢固及无松动后方可使用。如发现问题请及时联系活动室管理员；</div>\n' +
//        '<div class="stitle">3、请依据您目前的身体状况选择合适的器材进行锻炼，健身器材设计载重为100KG；</div>\n' +
//        '<div class="stitle">4、不得携带食品入内，严禁吸烟、随地吐痰、乱丢瓜皮、果壳、纸屑等，严禁带宠物入内，应保持室内卫生、整洁；</div>\n' +
//        '<div class="stitle">5、进入健身房必须穿着运动鞋、软底鞋，健身前进行充分热身，以免造成身体伤害。禁止穿高跟鞋和带钉鞋进入，以防损坏器材和地面；</div>\n' +
//        '<div class="stitle">6、健身器械和用具由行政安全中心统一管理和使用，严禁挪动健身器材等室内设施，擅自外借使用或据为己用；</div>\n' +
//        '<div class="stitle">7、不与人打斗、追跑，严禁违规操作器械，不盲目加大运动量和运动幅度（使用通电有氧健身器械时，连续运动时间不宜超过30分钟），在进行自由配重锻炼时，应有旁人保护，预防身体伤害和器械磕碰伤害，出现意外情况请与活动室管理员联系，以便协助应急治疗；</div>\n' +
//        '<div class="stitle">8、运动完毕后将器械回归原位，离开时带好随身携带的物品；</div>\n' +
//        '<div class="stitle">9、若因未遵守相关的管理规定而造成的意外，后果自行承担；</div>\n' +
//        '<div class="stitle">10、本管理规定自发布之日起执行，最终解释权归欣旺达电子股份有限公司所有。</div>\n',
        rules:''
      }
    },
    created() {

    },
    mounted() {
      this.userName=this.$route.params.userName;
      this.areaName=this.$route.params.areaName;
      this.roomId=this.$route.params.roomId;
      this.roomName=this.$route.params.roomName;
      if(!this.areaName){
        console.log(this.areaName);
        this.areaName='石龙仔'
      }
//      if(this.roomId==14||this.roomId==15){
//        this.rules=this.shuqing;
//      }else if(this.roomId==19){
//        this.rules=this.duo;
//      }else if(this.roomId==10){
//        this.rules=this.sport;
//      }else if(this.roomId==16||this.roomId==17||this.roomId==18){
//        this.rules=this.video;
//      }else if(this.roomId==11||this.roomId==12||this.roomId==13){
//        this.rules=this.yoga;
//      }else if(this.roomId==1||this.roomId==2||this.roomId==3||this.roomId==4||this.roomId==5||this.roomId==9){
//        this.rules=this.strGuangming;
//      }else if(this.roomId==8||this.roomId==6){
//        this.rules=this.shilongzai;
//      }
      console.log(ruldata);
      this.rules=ruldata(this.roomId);
      this.strGuangming=this.rules;
      console.log(this.rules);

      this.getRoomData();
      this.$alert(this.rules, '欣旺达活动室管理规定', {
        dangerouslyUseHTMLString: true
      });
    },
    methods: {
      yourClose(){
       this.yourDialog=false;
      },
      qClose(){
        this.qDialog=false;
        this.signDate=''
      },
      myClose(){
        let vm=this;
        vm.myDialog=false
      },
      getSignNum(){
        let vm = this;
        $.ajax({
          url: vm.pathpar.url+'findSurplusPersion.json',
          dataType: "json",
          data: {
            dateTime:this.signDate,
            roomId:vm.roomId
          },
          type: "get",
          success: function (res) {
            console.log(res);
            vm.signNum=res.dataInfo.listData[0].personNum
            console.log(vm.signNum)
          },
          error: function () {
          }
        });
      },
      dataHandler(res) {
        res.extData.notStart = [];
        res.extData.notStartWeek = [];
//        res.extData.notEnd=[];
//        res.extData.notEndWeek=[];
        res.extData.usingTimeList = [];
        res.extData.usingTimeWeekList = [];
        res.extData.testData = res.extData.roomInfo.usingTime.split(";");
        if(res.extData.roomInfo.usingTimeWeek){
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
        this.notStart=res.extData.notStart;
        this.notStartWeek=res.extData.notStartWeek;
        this.testData=res.extData.testData;
        this.testDataWeek=res.extData.testDataWeek;
        this.usingTimeStartList = this.arrayDiff(res.extData.notStart, res.extData.usingTimeList);
//        this.usingTimeEndList = this.arrayDiff(res.extData.notEnd, res.extData.usingTimeList);
        this.usingTimeWeekStartList = this.arrayDiff(res.extData.notStartWeek, res.extData.usingTimeWeekList);
//        this.usingTimeWeekEndList = this.arrayDiff(res.extData.notEndWeek, res.extData.usingTimeWeekList);
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
      myGetEnd() {
        this.endTime='';
        if(this.isCut==1){
          console.log(this.notEnd)
          var finalEnd = [];
          var middleData=[];
          console.log(this.endData)
          console.log(this.startTime)
          if(this.ifWeek){
            console.log(this.testDataWeek)
            for(var i=0;i<this.testDataWeek.length;i++){
              for(var t=0;t<this.testDataWeek[i].length;t++){
                if(this.testDataWeek[i][t].indexOf(this.startTime)!=-1){
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
          }else{
            for(var i=0;i<this.testData.length;i++){
              for(var t=0;t<this.testData[i].length;t++){
                if(this.testData[i][t].indexOf(this.startTime)!=-1){
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
        }else{
          this.finalEndData=[];
          if(!this.ifWeek){
            for(var w=0;w<this.startData.length;w++){
              if(this.startTime==this.startData[w]){
                this.finalEndData.push(this.notStart[w])
              }
            }
          }else {
            for(var w=0;w<this.startData.length;w++){
              if(this.startTime==this.startData[w]){
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
        this.getSignNum();
      },
      getOpenDate(res){
        var date = new Date();
        this.getMyDate(date);
        if(res.extData.roomInfo.beforeOrder >0){
          for(var i=0;i<res.extData.roomInfo.beforeOrder;i++){
            date=new Date(date.getTime() + 24*60*60*1000);
            this.getMyDate(date)
          }
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
          url: vm.pathpar.url+'findActivityRoom.json',
          dataType: "json",
          data: {
            token:localStorage.getItem("token"),
            roomId:vm.roomId
          },
          type: "get",
          success: function (res) {
            console.log(res);
            vm.userName=res.extData.userName;
            if(res.extData.roomInfo.isCut==0){
              vm.isCut=0
            }
            vm.openTime=res.extData.roomInfo.openTime.split(",");
            vm.getCanSign(res);
            vm.getOpenDate(res);
            vm.dataHandler(res)
          },
          error: function () {
          }
        });
      },
      getCanSign(res){
        var canSignTime=res.extData.roomInfo.orderTime.split(",");
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
       var currentDate = year + seperator1 + month + seperator1 + strDate;
        this.orderStart=new Date(currentDate+" "+canSignTime[0]).getTime();
        this.orderEnd=new Date(currentDate+" "+canSignTime[1]).getTime();
      },
      getAccess(){
        if(this.roomId==8||this.roomId==6||this.roomId==11||this.roomId==12||this.roomId==13||this.roomId==9){
          let vm = this;
          $.ajax({
            url: vm.pathpar.url+'findisYogaMember.json',
            dataType: "json",
            data: {
              token:localStorage.getItem("token"),
            },
            type: "post",
            success: function (res) {
              console.log(res);
              if(res.extData==0){
                 vm.myDialog=true
              }else{
                vm.sign()
              }
            },
            error: function () {
            }
          });
        }else{
          this.sign()
        }
      },
      sign(){
        if(this.checked){
          var userSignTime=new Date().getTime();
          if(this.orderStart>userSignTime||this.orderEnd<userSignTime){
            this.yourDialog=true
          }else{
            console.log(this.openTime)
            if(this.openTime.indexOf(this.selectDay.toString())==-1){
              this.qDialog=true
            }else{
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
                if(nowTimeC>signTimeC){
                  if(nowTimeC>signTimeC){
                    var str='您所选择的时间不符合预约规则(当前时间已大于您的预约开始时间),请重新选择预约时间。';
                    this.$message({
                      message:str,
                    });
                    this.startTime='';
                    this.endTime=''
                  }
                }else{
                  let vm = this;
                  $.ajax({
                    url: vm.pathpar.url+'saveActivityBook.json',
                    dataType: "json",
                    data: {
                      token:localStorage.getItem("token"),
                      roomId:vm.roomId,
                      dateTime:vm.signDate,
                      startDateStr:vm.startTime,
                      endDateStr:vm.endTime
                    },
                    type: "post",
                    success: function (res) {
                      console.log(res);
                      if(res.message=='操作成功'){
                        vm.$message('预约成功');
                        setTimeout(function () {
                          vm.$router.push('/home?token='+localStorage.getItem("token"))
                        },2000)
                      }else if(res.message=='您因爽约超过三次，已被拉入黑名单，请于{0}后再进行预约'){
                        vm.$message('您因爽约超过三次，已被拉入黑名单，请于两个月后再进行预约')
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
                  url: vm.pathpar.url+'saveActivityBook.json',
                  dataType: "json",
                  data: {
                    token:localStorage.getItem("token"),
                    roomId:vm.roomId,
                    dateTime:vm.signDate,
                    startDateStr:vm.startTime,
                    endDateStr:vm.endTime
                  },
                  type: "post",
                  success: function (res) {
                    console.log(res);
                    if(res.message=='操作成功'){
                      vm.$message('预约成功')
                      setTimeout(function () {
                        vm.$router.push('/home?token='+localStorage.getItem("token"))
                      },2000)
                    }else if(res.message=='您因爽约超过三次，已被拉入黑名单，请于{0}后再进行预约'){
                      vm.$message('您因爽约超过三次，已被拉入黑名单，请于两个月后再进行预约')
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
        }else{
         this.$message("请确认您已经阅读预约规则")
        }

      },
      openMessage(){
        this.$alert(this.strGuangming, '欣旺达光明员工活动室管理规定', {
          dangerouslyUseHTMLString: true
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
  .read{
    position: absolute;
    bottom: 12%;
    left: 0;
    height:40px;
    text-align: center;
    width:100%;
    line-height: 40px;
  }
  .footB{
    position: absolute;
    bottom: 3%;
    left: 0;
    height:50px;
    text-align: center;
    width:100%;
    line-height: 50px;
  }
</style>

