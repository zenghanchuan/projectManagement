<template>
  <div class="about">
    <Select class="dropDown" v-model="model1" style="width:90px" :label-in-value="true" @on-change='changeSelectPro' placeholder="项目状态">
        <Option v-for="(i,k) in cityList" :value='i.name' :tag='i.changeNum' :key="k">{{i.name}}</Option>
    </Select>
    <Table border :columns="columns12" :data="data6" style="height:70vh">
        <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
        </template>
        <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">修改</Button>
        </template>
    </Table>
    <template>
        <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" 
        show-elevator  show-total placement="top">
        </Page>
    </template>
    <Modal
        v-model="modal2"
        title="项目状态修改"
        @on-ok="ok"
        @on-cancel="cancel">
        <!-- <Input v-model="input1" placeholder='任务名称' style="width:120px"></Input> -->
        <Dropdown trigger="click" style="margin-left: 20px" @on-click='modifyState'>
                    <a href="javascript:void(0)">
                        {{proState}}
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list" v-for="(i,k) in allStates" :key="k">
                        <DropdownItem :name="i.name">{{i.value}}</DropdownItem>
                    </DropdownMenu>
        </Dropdown>
    </Modal>
  </div>
</template>
<script>
export default {
  data(){
return {
        columns12: [{title: 'ID',key: 'id',width:70,},
                    {title: '项目名称',key: 'projectName'},
                    {title: '项目负责人',key: 'projectOrganizer'},
                    {title: '项目开始时间',key: 'projectStartTime'},
                    {title: '截止日期',key: 'projectEndTime'},
                    {title: '项目模块',key: 'projectModular'},
                    {title: '团队成员',key: 'projectMember'},
                    {title: '项目状态',key: 'statusName'},
                    {title: 'Action',slot: 'action',width: 150,align: 'center'}],
                data6: [],
                selectPro:'',
                cityList: [
                    {name:'全部项目',label:'',changeNum:''},       //''
                    {name: '未开始',label: '0',changeNum:0},       //0
                    {name: '已关闭',label: '5',changeNum:5},       //5
                    {name: '进行中',label: '1',changeNum:1},       //1
                    {name: '已暂停',label: '2',changeNum:2},       //2
                    {name: '已完成',label: '3',changeNum:3},       //3
                    {name: '已取消',label: '4',changeNum:4},       //4
                ],
                model1: '',     //项目状态查询
                modal2: false,
                proState:'请选择',
                allStates:[{name:'未开始0',value:'未开始'},{name:'进行中1',value:'进行中'},{name:'已暂停2',value:'已暂停'},{name:'已完成3',value:'已完成'},{name:'已取消4',value:'已取消'},{name:'已关闭5',value:'已关闭'}],
                input1:'项目名称',
                pageTotal: 0,  //数据总数
                pageNum: 1,    //初始页
                pageSize: 10,  //每页条数
                dataArr :[],   //页面显示的数组
                dataIndex:0,   //修改按钮选中的索引值,
                proStateName:'',
            }            
  },
  mounted(){
      /**页面创建时加载全部项目数据 */
      this.allProState();
  },
  methods: {
            /**点击修改按钮弹出对话框 */
            show (index) {
                this.dataIndex = this.data6[index].id
                this.modal2 = true;
            },
            /**修改对话框数据提交的点击事件 */
            ok(){
                var that = this;
                /**修改接口 */
                this.$http.put(this.$store.state.url + '/project/update',{id:this.dataIndex,status:this.proStateName}).then((res) =>{
                    console.log(res)
                    if(res.data.code == '10000'){
                        this.$Message.success('修改成功！');
                        if(this.selectPro == ''){
                            that.allProState();
                            return;
                        }
                        that.queryData();
                    }else{
                        this.$Message.error('修改失败');
                    }
                }).catch((err) =>{
                    console.log(err)
                })
                this.modal2 = false;
            },
            /**关闭对话框事件 */
            cancel(){
                this.modal2 = false;
            },
            // selectState (index) {
            //   console.log(index)
            // },
            // remove (index) {
            //     this.data6.splice(index, 1);
            // },
            /**选择项目状态进行查询 */
            changeSelectPro(value,type){
                var that = this;
                // console.log(value.tag);
                this.selectPro = value.tag;
                if(this.selectPro == ''){
                    that.allProState();
                }
                this.queryData();
            },
            /**根据项目状态对应的中文名渲染 */
            modifyState(name){
                this.proState = name.substring(0,3);
                this.proStateName = name.substring(3,4);
            },
            /**全部项目查询接口 */
            allProState(){
                var that = this;
                that.$http.get(that.$store.state.url + '/project/findAll',{params:{}}).then((res) =>{
                    console.log(res)
                    if(res.data.code == '10000'){
                        let arr = res.data.object.items;
                        for(let i=0;i<arr.length;i++){
                            if(arr[i].status == 0){
                                Object.assign(arr[i], {statusName: '未开始',});
                            }else if(arr[i].status == 1){
                                Object.assign(arr[i], {statusName: '进行中',});
                            }
                            else if(arr[i].status == 2){
                                Object.assign(arr[i], {statusName: '已暂停',});
                            }
                            else if(arr[i].status == 3){
                                Object.assign(arr[i], {statusName: '已完成',});
                            }
                            else if(arr[i].status == 4){
                                Object.assign(arr[i], {statusName: '已取消',});
                            }
                            else if(arr[i].status == 5){
                                Object.assign(arr[i], {statusName: '已关闭',});
                            }
                        }
                        this.data6 = arr;
                        that.pageTotal = res.data.object.total;       
                        var _start = ( that.pageNum - 1 ) * that.pageSize;  //pageNum 第几页  pageSize:每页几条数据
                        var _end = that.pageNum * that.pageSize;
                        }
                        else if(res.data.code == '10001'){
                            this.$Message.error('登录超时！');
                            localStorage.clear();
                            this.$router.push('/login');
                        }
                }).catch((err)=>{
                    console.log(err)
                })
            },
            /**按需查询接口 */
            queryData(){
                var that=this;
                this.$http.get(this.$store.state.url + '/project/findAll',{params:{status:this.selectPro}}).then((res) =>{
                  console.log(res)
                  if(res.data.code == '10000'){
                        let arr = res.data.object.items;
                        for(let i=0;i<arr.length;i++){
                            if(arr[i].status == 0){
                                Object.assign(arr[i], {statusName: '未开始',});
                            }else if(arr[i].status == 1){
                                Object.assign(arr[i], {statusName: '进行中',});
                            }
                            else if(arr[i].status == 2){
                                Object.assign(arr[i], {statusName: '已暂停',});
                            }
                            else if(arr[i].status == 3){
                                Object.assign(arr[i], {statusName: '已完成',});
                            }
                            else if(arr[i].status == 4){
                                Object.assign(arr[i], {statusName: '已取消',});
                            }
                            else if(arr[i].status == 5){
                                Object.assign(arr[i], {statusName: '已关闭',});
                            }
                        }
                        this.data6 = arr;
                        that.pageTotal = res.data.object.total;       
                        var _start = ( that.pageNum - 1 ) * that.pageSize;  //pageNum 第几页  pageSize:每页几条数据
                        var _end = that.pageNum * that.pageSize;
                        this.$Message.success('查询成功!');
                  }else{
                      this.$Message.error('筛选失败');
                  }
              }).catch((err) =>{
                  console.log(err)
              })
            },
        }
}
</script>
<style lang="less" scoped>
.about{
  .dropDown{
    font-weight: bold;
  }
}
</style>