<template>
  <div >
    <div class="outer" v-for="item in data">
      <div class="firstD">
        <div class="start">预约号 :  <span style="font-weight: normal;color: blue">{{item.book.bookNo}}</span></div>
        <span class="end">{{item.book.roomName}}</span>
      </div>
      <div class="secondD">
        <div class="item">
          <span class=key>预约人 : </span>
          <span class="value">{{item.book.userName}}</span>
        </div>
        <div class="item" v-show="item.fName">
          <span class=key>家属 : </span>
          <span class="value">{{item.fName}}</span>
        </div>
        <div class="item">
          <span class=key>预约日期 : </span>
          <span class="value">{{item.book.dateTime}}</span>
        </div>
        <div class="item">
          <span class=key>预约时段 : </span>
          <span class="value">{{item.book.startDateStr}}-{{item.book.endDateStr}}</span>
        </div>

      </div>
      <div class="thirdD">
        <el-button type="primary" round size="small" style="width: 70px" v-show="ifShow" @click="myRewrite(item.book)">修改</el-button>
        <el-button type="primary" round size="small" style="width: 70px" v-show="ifShow" @click="myDetele(item.book)">取消</el-button>
      </div>
      <div style="height: 1px;width: 100%;background-color: #eeeeee;margin-top: 10px"></div>
    </div>
    <div class="ownerBack" @click="turnBack">
      <div style="display: flex;align-items: center">
        <!--<i class="el-icon-d-arrow-left"></i>-->
        <span class="text"><< 返回</span>
      </div>
    </div>
    <!--<div >-->
      <!--<el-button  icon="el-icon-arrow-left" class="myBack" @click="turnBack"></el-button>-->
    <!--</div>-->



  </div>

</template>

<script>
    export default {
        props: {
          flag:'',
        },
        data: function () {
            return {
              data:[],
              ifShow:true
            }
        },
        created() {

        },
        mounted() {
          this.getData(0,1)
        },
        watch: {
          flag: function (newQuestion, oldQuestion) {
            if(newQuestion==1){
              this.getData(1,4);//已签到已离开 已签到未离开
              this.ifShow=false
            }else if(newQuestion==2){
              this.getData(2,8);
              this.ifShow=false
            }else if(newQuestion==3){
              this.getData(3,8);
              this.ifShow=false
            }else if (newQuestion==0){
              this.getData(0,1);
              this.ifShow=true
            }
          }
        },
        methods:{
          getData(a,b){
            let vm=this;
            $.ajax({
              url: vm.pathpar+'findActivityBook.json',
              dataType: "json",
              data: {
                token:localStorage.getItem("token")
              },
              type: "get",
              success: function (res) {
                console.log(res);
                vm.data=res.dataInfo.listData.filter(item => item.book.bookStutas===a||item.book.bookStutas===b);
                if(vm.data.length===0){
                  vm.$message("当前选择项下无数据。")
                }
              },
              error: function () {
              }
            });
          },
          myRewrite(opt){
            let vm=this;
            this.$emit("myRewrite",{
              bookId:opt.bookId,
              roomId:opt.roomId,
              roomName:opt.roomName,
              userName:opt.userName,
              areaName:opt.areaName
            })
          },
          myDetele(opt){
            let vm=this;
            this.$emit("myDelete",{
              bookId:opt.bookId,
              roomId:opt.roomId,
              roomName:opt.roomName,
              userName:opt.userName,
              areaName:opt.areaName
            })
          },
          turnBack(){
            let vm=this;
            this.$emit("turnBack",{
            })
          }
        }

    }
</script>
<style scoped >
  .ownerBack{
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    height: 30px;
    background-color: #eeeeee;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .text{
    margin-left: 10px;
    height: 16px;
    display: flex;
    align-items: center;
  }
  .outer{
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    background-color: white;
  }
  .firstD{
    height: 30px;
    display: flex;
    align-items: center;
    justify-content:flex-end;
  }
  .start{
    flex: 1;
    height: 30px;
    line-height: 30px;
    color: #009688;
    font-size: 16px;
    font-weight: bold;
  }
  .end{
    display: flex;
    justify-content: flex-end;
    width: 100px;
    height: 30px;
    color: #009688;
    font-size: 16px;
  }
  .secondD{
    padding: 10px 10px 0 10px;
    /*height: 120px;*/
    width: 100%;
    box-sizing: border-box;
  }
  .item{
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .key{
    height: 28px;
    color:darkgrey;
    /*width: 100px;*/
    font-size: 16px;
  }
  .value{
    margin-left: 10px;
    height: 28px;
    flex:1;
    color: black;
    font-size: 16px;
  }
  .thirdD{
    text-align: right;
  }
  .myBack{
    height: 70px;
    width: 70px;
    border-radius: 50%;
    position: fixed;
    right: 30px;
    bottom: 50px;
    border: 1px solid #4682B4;
    font-size: 18px;
    color:#4682B4;
    padding: 0
  }
</style>

