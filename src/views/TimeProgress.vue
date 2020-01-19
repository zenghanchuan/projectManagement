<!--日报展示-->
<template>
  <div class="timeProgress">
    <div id="myChart" :style="{width: '38%', height: '70%'}">横轴为项目组成员名字，纵轴为工作任务数量</div>
    <div class="selectDate">
      <Row>
        <Col span="12">
            <DatePicker type="date" @on-change="changeData" format="yyyy-MM-dd" placeholder="Select date" style="width: 120px"></DatePicker>
        </Col>
      </Row>
    </div>
    <div class="summaryToday">
        <h3 class="sumTitle">今日简报:{{todayDate}}</h3>
        <p class="sumContent">{{todayContent}}</p>
        <span class="myname">技术部:{{myname}}</span>
    </div>
  </div>
</template>
<script>
import server from '../../server';
export default {
  data(){
    return{
        todayDate:'',
        todayContent:'当前暂无数据',
        myname:'zenghanchuan',
        selectDay:'',
        dataTable:['姓名', 7, 9, 0,2],
    }
  },
  mounted(){
    this.todayDate = server.addDate();
    this.dateQuery();
    this.drawLine();
  },
  methods:{
    drawLine(){                    // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        myChart.setOption({
            title : {
                text: '个人当天工作详情',
                subtext: '实时数据'
            },
            legend: {},
            tooltip: {},
            dataset: {
                source: [
                    ['product', '预计', '实际', '未完成','超额'],
                    // ['zenghanchuan', 7, 9, 0,2],
                    this.dataTable,
                ]
            },
            xAxis: {type: 'category'},
            yAxis: {},
            series: [
                {type: 'bar'},
                {type: 'bar'},
                {type: 'bar'},
                {type: 'bar'},
            ]
        });  
    },
    changeData(e){
      var that = this;
                if(e){this.selectDay = e;}
                this.todayDate = e;
                this.dateQuery();
                this.drawLine();
            },
    dateQuery(){
      var that = this;
      var userId = localStorage.getItem('userId');
      var username = localStorage.getItem('username');
      this.myname = username;
       this.$http.post(this.$store.state.url + '/briefing/findByUserIdAndDate',{userId:userId,creatTime:this.todayDate}).then((res)=>{
          console.log(res)
          if(res.data.code == '10000'){
              that.dataTable[0] = username;
              that.dataTable[1] = res.data.object.planNum;
              that.dataTable[2] = res.data.object.realNum;
              that.dataTable[3] = res.data.object.undoneNum;
              that.dataTable[4] = res.data.object.excessNum;
              that.todayContent = res.data.object.briefingDescription;
              this.drawLine();
              this.$Message.success('成功')
              return
              }else if(res.data.code == "10009"){
                this.$Message.error('暂无数据');
              }else if(res.data.code == "10001"){
                this.$Message.error('登录超时');
              }else{
                this.$Message.error('数据异常');
              }
       }).catch((err)=>{
         console.log(err)
       })
    },
    },
}
</script>
<style lang="less" scoped>
.timeProgress{
    display: flex;
    flex-wrap: wrap;
    height: 900px;
  .selectDate{
    display: flex;
    justify-content: flex-start;
    margin-top: 0.5%;
  }
  .myChart{
    width: 100%;
    display: flex;
  }
  .summaryToday{
    display: flex;
    width: 40%;
    height: 100%;
    margin-left: 5%;
    flex-direction: row;
    flex-wrap: wrap;
    .sumTitle{
        display: inline-flex;
        width: 25%;
        height: 10%;
        align-items: center;
    }
    .sumContent{
        display: flex;
        width: 80%;
        justify-content: flex-start;
        margin: 10% 0 0 -10%;
    }
    .myname{
        display: inline-flex;
        width: 30%
    }
  }
}
</style>