<!--当前任务-->
<template>
  <div class="nowProject">
    <Dropdown trigger="click" style="margin-left: 20px" @on-click='selectProgress'>
                    <h3>
                        {{proName}}
                        <Icon type="ios-arrow-down"></Icon>
                    </h3>
                    <DropdownMenu slot="list" v-for="(i,k) in allProg" :key="k">
                        <DropdownItem :name="i.projectName">{{i.projectName}}</DropdownItem>
                    </DropdownMenu>
        </Dropdown>
    <ul>
      <li style="background: #7EC5FF;">未开始
        <div>
          <ul v-for="(i,k) in dataArr0" :key="k">
            <li>
              <p>{{i.taskDescription}}</p>
              <b>{{i.taskName}}</b>
              <span>{{i.taskType}}</span>
            </li>
          </ul>
        </div>
      </li>
      <li style="background: #0991FF;">进行中
        <div>
          <ul v-for="(i,k) in dataArr1" :key="k">
            <li>
              <p>{{i.taskDescription}}</p>
              <b>{{i.taskName}}</b>
              <span>{{i.taskType}}</span>
            </li>
          </ul>
        </div>
      </li>
      <li style="background: #fdc137;">已暂停
        <div>
          <ul v-for="(i,k) in dataArr2" :key="k">
            <li>
              <p>{{i.taskDescription}}</p>
              <b>{{i.taskName}}</b>
              <span>{{i.taskType}}</span>
            </li>
          </ul>
        </div>
      </li>
      <li style="background: #0BD986;">已完成
        <div>
          <ul v-for="(i,k) in dataArr3" :key="k">
            <li>
              <p>{{i.taskDescription}}</p>
              <b>{{i.taskName}}</b>
              <span>{{i.taskType}}</span>
            </li>
          </ul>
        </div>
      </li>
      <li style="background: #CBD0DB;">已取消
        <div>
          <ul v-for="(i,k) in dataArr4" :key="k">
            <li>
              <p>{{i.taskDescription}}</p>
              <b>{{i.taskName}}</b>
              <span>{{i.taskType}}</span>
            </li>
          </ul>
        </div>
      </li>
      <li style="background: #838A9D;">已关闭
        <div>
          <ul v-for="(i,k) in dataArr5" :key="k">
            <li>
              <p>{{i.taskDescription}}</p>
              <b>{{i.taskName}}</b>
              <span>{{i.taskType}}</span>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <template>
        <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" 
        show-elevator  show-total placement="top" @on-change="handlePage">
        </Page>
    </template>
  </div>
</template>
<script>
export default {
  data(){
    return{
      pageTotal: 2,  //数据总数
      pageNum: 1,  //初始页
      pageSize: 10,  //每页条数
      dataArr :[],   //页面显示的数组  
      dataArr0:[],
      dataArr1:[],
      dataArr2:[],
      dataArr3:[],
      dataArr4:[],
      dataArr5:[],
      allProg:[{name:'来骑哦小程序'}],     
      proName:'请选择项目',   
      proNameId:1,          
    }
  },
  mounted(){
    this.allProgress();
    this.allTasts();
  },
  methods:{
          handlePage(value){},
          /**获取选择的项目名称及遍历项目id */
          selectProgress(name){
            var that = this;
            this.proName = name;
            for(let i=0;i<this.allProg.length;i++){
                if(that.allProg[i].projectName == name){
                    that.proNameId = that.allProg[i].id;
                  }
            }
            this.dataArr0=[];this.dataArr1=[];this.dataArr2=[];this.dataArr3=[];this.dataArr4=[];this.dataArr5=[];
            this.allTasts();           
          },
          /**根据项目id查询项目任务 */
          allTasts(){
            var that = this;
            this.$http.get(this.$store.state.url + '/task/findByroId',{params:{projectId:this.proNameId}}).then((res) =>{
              if(res.data.code == '10000'){
                console.log(res)
                // this.dataArr = res.data.object.items;
                let arr = res.data.object.items;
                for(let i=0;i<arr.length;i++){
                  if(arr[i].status == 0){
                    that.dataArr0.push(arr[i])
                  }else if(arr[i].status == 1){
                    that.dataArr1.push(arr[i])
                  }else if(arr[i].status == 2){
                    that.dataArr2.push(arr[i])
                  }else if(arr[i].status == 3){
                    that.dataArr3.push(arr[i])
                  }else if(arr[i].status == 4){
                    that.dataArr4.push(arr[i])
                  }else if(arr[i].status == 5){
                    that.dataArr5.push(arr[i])
                  }
                }
                that.pageTotal = res.data.object.total;       
                var _start = ( that.pageNum - 1 ) * that.pageSize;  //pageNum 第几页  pageSize:每页几条数据
                var _end = that.pageNum * that.pageSize;
                this.$Message.success('查询成功')
              }
            }).catch((err) =>{
              console.log(err)
              this.$Message.error('任务查询系统异常')
            })
          }, 
          /**获取所属项目的全部列表接口 */
          allProgress(){
                    this.$http.get(this.$store.state.url + '/project/findProName',{params:{}}).then((res) =>{
                        if(res.data.code == '10000'){
                            this.allProg = res.data.object;
                        }else if(res.data.code == '10001'){
                            this.$Message.error('登录超时,请重新登录验证')
                        }
                    }).catch((err) =>{
                        console.log(err)
                    })
          },          
  }
}
</script>
<style lang="less" scoped>
.nowProject{
  ul{
    width: 100%;
    li{
    list-style: none;
    width: 16%;
    position: relative;
    float: left;
    margin: 2% 0 0 0.5%;
    text-align: center;
    div{
      // margin-top: 10px;
      background: white;
      border-right: 1px solid #9999;
      height: 60vh;
      ul{
        li{
          width: 90%;
          text-align: left;
          height: 10%;
          padding: 5px;
          margin-left: 1vh;
          border: 1px solid #9999;
          font-size: 13px;
          b{
            font-weight: normal;
            margin-top: 5%;
            display: block;
          }
          span{
            float: right;
            margin-top: -9%;
          }
        }
      }
    }
  }
  }
}
</style>