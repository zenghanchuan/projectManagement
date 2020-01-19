<template>
  <div class="createTast">
    <h3>任务的创建与分配</h3>
    <Button type="primary" class="addnewtast" @click="addTast"><Icon type="ios-add-circle-outline" />新增</Button>
    <!-- <Button type="primary" class="modify" @click="modal1 = true"><Icon type="ios-build-outline" />修改</Button> -->
    <Table class="tabletast" border :columns="columns12" :data="data6" style="height:60%">
        <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
        </template>
        <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)"><Icon type="ios-build-outline" />修改</Button>
        </template>
    </Table>
    <template>
        <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" 
        show-elevator  show-total placement="top">
        </Page>
    </template>
    <template>
    <Modal
        v-model="modal1"
        title="新增任务详情"
        @on-ok="ok"
        @on-cancel="cancel">
            <Form :model="formLeft" label-position="left">
            <FormItem>
                <Input v-model="formLeft.input1" placeholder='创建日期' style="width:120px"></Input>
            </FormItem>
            <FormItem>
                <Input v-model="formLeft.input2" placeholder='预计结束时间' style="width:120px"></Input>
            </FormItem>
            <FormItem>
                <Input v-model="formLeft.input3" placeholder='任务名称' style="width:120px"></Input>
            </FormItem>
            <FormItem>
                <!-- <Input v-model="formLeft.input2" placeholder='所属项目' style="width:120px"></Input> -->
                <Dropdown trigger="click" style="margin-left: 20px" @on-click='selectProject'>
                    <a href="javascript:void(0)">
                        {{protName}}
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list" v-for="(i,k) in allPro" :key="k">
                        <DropdownItem :name="i.projectName">{{i.projectName}}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </FormItem>
            <FormItem>
                <!-- <Input v-model="formLeft.input6" placeholder='类型' style="width:100px"></Input> -->
                <Dropdown trigger="click" style="margin-left: 20px" @on-click='selectname'>
                    <a href="javascript:void(0)">
                        {{typename}}
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name='测试'>测试</DropdownItem>
                        <DropdownItem name='研发'>研发</DropdownItem>
                        <DropdownItem name='讨论'>讨论</DropdownItem>
                        <DropdownItem name='其他'>其他</DropdownItem>
                        <DropdownItem name='上线'>上线</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </FormItem>
            <FormItem>
                <!-- <textarea v-model="formLeft.input3" placeholder='相关需求' style="width:100%"></textarea> -->
                <Dropdown trigger="click" style="margin-left: 20px" @on-click='selectState'>
                    <a href="javascript:void(0)">
                        {{selectPersonal}}
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list" v-for="(o,j) in assignList" :key="j">
                        <DropdownItem :name="o.username">{{o.username}}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </FormItem>
            <FormItem>
                <textarea v-model="formLeft.input4" placeholder='任务描述' style="width:100%"></textarea>
            </FormItem>
        </Form>
    </Modal>
</template>
  </div>
</template>
<script>
export default {
  data () {
            return {
                columns12: [
                    {title: 'Date',key: 'startTime',width:130,},
                    {title: 'numberID',key: 'id',width:120},
                    {title: '任务描述',key: 'taskDescription'},
                    {title: '任务名称',key: 'taskName',width:160,},
                    {title: '类型',key: 'taskType',width:100},
                    {title: '预计结束时间',key: 'planEndTime',width:130},
                    {title: '指派人',key: 'assign',width:130},
                    {title: 'Action',slot: 'action',width: 150,align: 'center'}],
                data6: [],
                selectPro:'指派人',         //获取的数据进行数组填充
                 modal1: false,
                 formLeft: {
                    input1: '',//创建时间
                    input2: '',//结束时间
                    input3: '',//任务名称
                    input4: '',
                    input5: '',
                    input6: '',
                    input7: '',
                },
                typename:'类型',
                protName:'所属项目',
                protId:'',
                allPro:[{name:'来骑哦'}],
                selectPersonal:'指派给',
                assignList:[],
                assignId:'',    //指派人的id号
                pageTotal: 0,  //数据总数
                pageNum: 1,  //初始页
                pageSize: 10,  //每页条数
                dataArr :[],   //页面显示的数组   
                indexNum:{},    //修改按钮选中的数据
                flag:false, //判断是新增还是修改  false是新增 true为修改
            }
        },
        mounted(){
            this.addDate();
            this.allnoAssign();
            var that = this;
        },
        methods: {
            /**新增按钮 */
            addTast(){
                this.modal1 = true;
                /**获取所属项目的全部列表接口 */
                    this.$http.get(this.$store.state.url + '/project/findProName',{params:{}}).then((res) =>{
                        console.log(res)
                        if(res.data.code == '10000'){
                            this.allPro = res.data.object;
                        }else if(res.data.code == '10001'){
                            this.$Message.error('登录超时,请重新登录验证')
                        }
                    }).catch((err) =>{
                        console.log(err)
                    })
                    /**获取指派人的名称及所对于的id */
                    this.allPersonl();
            },
            /**指派人修改接口 */
            show (index) {
                var that = this;
                this.indexNum = this.data6[index];
                this.formLeft.input2 = this.indexNum.planEndTime;
                this.formLeft.input3 = this.indexNum.taskName;
                this.flag = true;
                this.allPersonl();
                this.modal1 = true;
            },
            /**根据选择的指派人姓名遍历指派人对于的id*/
            selectState (name) {
              var that = this;
              this.selectPersonal = name;
              for(let i=0;i<this.assignList.length;i++){
                  if(that.assignList[i].username == name){
                      that.assignId = that.assignList[i].id;
                  }
              }
            },
            /**创建指定项目的任务 */
            ok () {
                var that = this;
                if(this.flag == true){
                    this.$http.put(this.$store.state.url + '/task/update',{id:this.indexNum.id,userId:this.assignId,status:1}).then((res) =>{
                        console.log(res)
                        if(res.data.code == '10000'){
                            this.$Message.success('修改成功！')
                            that.flag = false;
                            this.allnoAssign();
                        }
                    }).catch((err) =>{
                        console.log(err)
                    })
                }else{
                    this.$http.post(this.$store.state.url + '/task/createTask',{taskName:this.formLeft.input3,taskType:this.typename,projectId:this.protId,startTime:this.formLeft.input1,planEndTime:this.formLeft.input2,taskDescription:this.formLeft.input4,status:'6',userId:this.assignId}).then((res) =>{
                    console.log(res)
                    if(res.data.code == '10000'){
                        this.$Message.success('新任务创建成功！')
                        //回显所有数据
                        this.allnoAssign();
                    }
                }).catch((err) =>{
                    console.log(err)
                })
                }
            },
            cancel () {
                this.$Message.info('Clicked cancel');
            },
            /**选择的任务类型 */
            selectname(name){
                var that = this;
                this.typename = name;  
            },
            /**默认选择当前时间作为任务创建的时间 */
            addDate() {
                    var date = new Date();
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
                    var currentdate = year + seperator1 + month + seperator1 + strDate;
                    this.formLeft.input1 = currentdate;
                },
                /**获取指派人的名称及所对于的id */
                allPersonl(){
                    this.$http.get(this.$store.state.url + '/user/findAll',{params:{}}).then((res) =>{
                        // console.log(res)
                        if(res.data.code == '10000'){
                            this.assignList = res.data.object;
                        }
                    }).catch((err) =>{
                        console.log(err)
                    })
                },
                /**根据选择的项目名称遍历项目对应的id */
                selectProject(name){
                    var that = this;
                    if(this.flag == true){
                        // this.$Message.error('所属项目不可更改！')
                        return;
                    }else{
                        console.log(name)
                        this.protName = name;
                        // this.protId = name.substring(0,2);
                        for(let i=0;i<this.allPro.length;i++){
                            if(that.allPro[i].projectName == name){
                                that.protId = that.allPro[i].id;
                            }
                        }
                    }
                },
            /**页面创建时查询所有没有指派人的任务 */
            allnoAssign(){
                var that = this;
                this.$http.get(this.$store.state.url + '/task/findByStatus',{params:{status:6,pageSize:10,page:1}}).then((res) =>{
                    console.log(res)
                    if(res.data.code == '10000'){
                        that.data6 = res.data.object.items;
                        that.pageTotal = res.data.object.totalPage;       
                        var _start = ( that.pageNum - 1 ) * that.pageSize;  //pageNum 第几页  pageSize:每页几条数据
                        var _end = that.pageNum * that.pageSize;
                    }
                }).catch((err) =>{
                    console.log(err)
                })
            },
        }
}
</script>
<style lang="less" scoped>
.createTast{
  margin-top: 2vh;
  h3{
      margin-left: 2%;
  }
  .addnewtast{
      float: right;
      margin-left: 1%;
  }
  .modify{
      float: right;
      margin-top: 0;
  }
  .tabletast{
      margin-top: 3%;
  }
}
</style>