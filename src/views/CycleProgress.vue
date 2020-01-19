<template>
  <div class="cycleProgress">
    <div id="myChart" :style="{width: '100%', height: '75vh'}"></div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      dataArr:[],
      dataLegend:[],
    }
  },
  mounted(){
    this.drawLine();
  },
  methods:{
  drawLine(){                    // 基于准备好的dom，初始化echarts实例
    var that = this;
    //获取不同项目状态下的数量
    this.$http.get(this.$store.state.url + '/project/statistics',{params:{}}).then((res) =>{
      if(res.data.code == '10000'){
        let obj = res.data.object;
        let arr = [];
        for(let i=0;i<7;i++){
          if(obj[i]){
            arr.push(i)
          }
        }
        for(let k=0;k<arr.length;k++){
          if(arr[k] == 0){
            this.dataLegend.push('未开始')
          }else if(arr[k] == 1){
            this.dataLegend.push('进行中')
          }else if(arr[k] == 2){
            this.dataLegend.push('已暂停')
          }else if(arr[k] == 3){
            this.dataLegend.push('已完成')
          }else if(arr[k] == 4){
            this.dataLegend.push('已取消')
          }else if(arr[k] == 5){
            this.dataLegend.push('已关闭')
          }
        }
        /**根据返回的数据渲染统计图中需要用到的data数据格式 */
        for(let j=0;j<arr.length;j++){
            if(obj[arr[j]][0].status == 0){
              that.dataArr.push({value:obj[arr[j]].length,name:'未开始',})
            }else if(obj[arr[j]][0].status == 1){
              that.dataArr.push({value:obj[arr[j]].length,name:'进行中',})
            }else if(obj[arr[j]][0].status == 2){
              that.dataArr.push({value:obj[arr[j]].length,name:'已暂停',})
            }else if(obj[arr[j]][0].status == 3){
              that.dataArr.push({value:obj[arr[j]].length,name:'已完成',})
            }else if(obj[arr[j]][0].status == 4){
              that.dataArr.push({value:obj[arr[j]].length,name:'已取消',})
            }else if(obj[arr[j]][0].status == 5){
              that.dataArr.push({value:obj[arr[j]].length,name:'已关闭',})
            }
        }
        // console.log(this.dataArr,this.dataLegend)
        // return;
        let myChart = this.$echarts.init(document.getElementById('myChart'))    
            myChart.setOption({
                        backgroundColor: '#2c343c',
                        title: {
                            text: '项目完成统计',
                            left: 'center',
                            top: 20,
                            textStyle: {
                                color: '#ccc'
                            }
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                        //bottom: 10,
                          left: '20',
                          top:'40',
                          orient:'vertical',
                          align:'right',
                          itemWidth:20,
                          data: that.dataLegend,
                          textStyle:{//图例文字的样式
                            color:'#fff',
                        }
                      },
                        visualMap: {
                            show: false,
                            min: 80,
                            max: 600,
                            inRange: {
                                // colorLightness: [0, 1]   视觉元素颜色的明暗度
                            }
                        },
                        series : [
                            {
                                name:'访问来源',
                                type:'pie',
                                radius : '55%',
                                center: ['50%', '50%'],
                                  data:that.dataArr.sort(function (a, b) { return a.value - b.value; }),
                                roseType: 'radius',
                                label: {
                                    normal: {
                                        textStyle: {
                                            // color: 'rgba(255, 255, 255, 0.3)'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        lineStyle: {
                                            color: 'rgba(255, 255, 255, 0.3)'
                                        },
                                        smooth: 0.2,
                                        length: 10,
                                        length2: 20
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        // color: '#c23531',
                                        shadowBlur: 200,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                },

                                animationType: 'scale',
                                animationEasing: 'elasticOut',
                                animationDelay: function (idx) {
                                    return Math.random() * 200;
                                }
                            }
                        ]
                    });
      }
    }).catch((err)=>{
      console.log(err)
    })
  },
  },
}
</script>
<style lang="less" scoped>
.cycleProgress{
  .myChart{
    width: 100%;
    height: 400px;
  }
}
</style>