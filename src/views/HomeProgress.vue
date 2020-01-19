<template>
    <div class="demo-split">
        <Split v-model="split1">
            <div slot="left" class="demo-split-pane">
                <h1 class="projectName">来骑哦技术部</h1>
                <div id="myChart" :style="{width: '300px', height: '400px'}"></div>
                <ul>
                  <li>技术总监:{{dataProject.projectCharge}}</li>
                  <li>办公地址:{{dataProject.startProject}}</li>
                  <li>部门职能:{{dataProject.endProject}}</li>
                  <li>部门口号:{{dataProject.projectCycle}}</li>
                </ul>
                <p class="projectCycle">项目组-来骑哦技术部：前端曾韩川、前端刘家豪、前端蔡洁，
                  后端邓国军、后端蒋勇、后端陈清权，UI刘玉琪，测试冯宇骁</p>
            </div>
            <div slot="right" class="demo-split-pane2">
              <div id="nodeTable" :style="{height: '400px'}"></div>
              <h3 class="proTit">项目周计划总结:</h3>
              <p class="proIntroduction">{{weekSummary}}</p>
            </div>
        </Split>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                split1: 0.5,
                dataProject:{
                  projectCharge:'曹大勇', //部门负责人
                  startProject:'环球中心',
                  endProject:'以对总公司提供技术支持为主，承接外包项目为辅',
                  projectCycle:'创新创业创精彩，赢天赢地赢未来。',
                },
                weekSummary:'暂无',
                timeNode:'5',//当前节点信息
            }
        },
        mounted(){
          this.drawLine();
          this.drawNodetable();
        },
        methods:{
          /**基于准备好的dom，初始化echarts实例 */
          drawLine(){
            let myChart = this.$echarts.init(document.getElementById('myChart'))    
            myChart.setOption({
                        title: {
                          text: '职位占比',
                          subtext: '部门架构',
                          left: 'center'
                        },
                        tooltip : {         //提示框
                          trigger: 'item',
                          formatter: "{a} <br/>{b} : {c} ({d}%)"
                      },
                      legend: {
                          bottom: 10,
                          left: 'center',
                          itemWidth:20,
                          data: ['前端', '后端','测试','UI']
                      },
                        series : [
                                  {
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '50%'],
                            selectedMode: 'single',
                            data:[
                                {value:3,name: '前端'},
                                {value:3, name: '后端'},
                                {value:0, name: '测试'},
                                {value:1, name: 'UI'},
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                            ]
                    });
                  },
                  /**上周周计划柱状图统计展示 */
                  drawNodetable(){
                    var that = this;
                    //获取上周计划数据
                    this.$http.get(this.$store.state.url + '/plan/findLast',{params:{}}).then((res)=>{
                      if(res.data.code == '10000'){
                        console.log(res)
                        if(res.data.object[4]){
                          that.weekSummary = res.data.object[4].weekSummary;
                        }
                        let weekdate = [],planArr = [],actualArr = [];//统计图的数据分别为星期数、计划数量、实际完成数量
                        let arr = res.data.object;
                        for(let i=0;i<arr.length;i++){
                          if(arr[i]){
                            var weekDay = ["周日","周一", "周二", "周三", "周四", "周五","周六"];
                            var dateStr = arr[i].createTime;
                            var myDate = new Date(Date.parse(dateStr.replace(/-/g, "/")));
                            arr[i].createTime = weekDay[myDate.getDay()];
                            console.log(weekDay[myDate.getDay()])
                            weekdate.push(arr[i].createTime);
                            planArr.push(arr[i].planTasks);
                            actualArr.push(arr[i].realTasks);
                          }
                        }
                        // console.log(weekdate,planArr,actualArr)
                        let nodeTable = this.$echarts.init(document.getElementById('nodeTable'))
                            nodeTable.setOption({
                                title: {
                                  text: '节点统计',
                                  // subtext: '第' + this.timeNode + '周',
                                  left:5
                                },
                                tooltip: {
                                  trigger: 'axis',
                                  axisPointer: {
                                      type: 'shadow'
                                  }
                              },
                              legend: {
                                  data: ['预计任务', '完成进度'],
                                  itemWidth:20,
                                  left:500
                              },
                              grid: {
                                  left: '2%',
                                  right: '55%',
                                  bottom: '3%',
                                  containLabel: true,
                                  width:800
                              },
                              xAxis: {
                                  type: 'value',
                                  boundaryGap: [0, 0.01],
                                  name:'完成数量',
                                  nameLocation:'center'
                              },
                              yAxis: {
                                  type: 'category',
                                  // data: ['周一','周二','周三','周四','周五']
                                  data:weekdate
                              },
                                series: [
                              {
                                  name: '预计任务',
                                  type: 'bar',
                                  data: planArr
                              },
                              {
                                  name: '完成进度',
                                  type: 'bar',
                                  data: actualArr
                              }
                          ]
                            });
                        return;
                      }else if(res.data.code == '10001'){
                        this.$Message.error('登录超时');
                        this.$router.push('/login')
                      }
                    }).catch((err)=>{
                      console.log(err)
                    })
                  },       
        },
    }
</script>
<style lang="less">
.demo-split{
        height: 700px;
        border: 1px solid #dcdee2;
      .demo-split-pane{
        padding: 10px;
        h1{
          width: 50%;
          text-align: center;
          font-weight: none;
          font-size: 24px;
          line-height: 50px;
          border-bottom: 1px solid #999;
          margin-left: 25%;
        }
        #myChart{
          // display: block;
          margin-left: 50%;
          margin-top: 5%;
        }
        ul{
          margin-top: -40%;
          li{
            list-style: none;
            font-size: 14px;
            border-bottom: 1px solid #333;
            width: 48%;
            line-height: 70px;
            // padding: 0 30px;
            display: block;
          }
        }
        p{
          font-size: 16px;
          margin-top: 5%;
          width: 60%;
          line-height: 40px;
        }
      }
      .demo-split-pane2{
        .dropDown{
          width: 40%;
          list-style: none;
          text-align: center;
          line-height: 30px;
          margin: 10px 0 0 20px;
        }
        .proTit{
          margin: 5% 0 0 5%;
        }
        .proIntroduction{
          font-size: 16px;
          margin: 3% 0 0 5%;
          width: 95%;
          line-height: 40px;
        }
      }
    }
    
</style>