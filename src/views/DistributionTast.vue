<!--我的任务-->
<template>
    <div class="distrionTast">
      <Collapse v-model="value2" :value="detailsTask[0].num" accordion @on-change="panelChange">
        <Panel v-for="(i,k) in detailsTask" :key="k">
            {{i.taskName}}
            <p slot="content" class="detail">任务创建时间：{{i.startTime}}<br>预计完成时间:{{i.planEndTime}}<br>
            任务状态:{{i.statusName}}<br>任务类型:{{i.taskType}}<br>所属项目:{{i.projectName}}<br>任务描述：{{i.taskDescription}}<Button type="primary" class="action" @click="activehandel" index='1'>操作</Button></p>
        </Panel>
    </Collapse>
    <Modal
        v-model="modal1"
        title="我的任务操作"
        ok-text="完成"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form :model="formLeft" label-position="left">
            <FormItem label="结束日期">
                <Input v-model="formLeft.input1" placeholder='结束日期' style="width:120px"></Input>
            </FormItem>
            <FormItem label="任务名称">
                <Input v-model="formLeft.input2" placeholder='任务名称' style="width:120px"></Input>
            </FormItem>
            <FormItem label="预计结束">
                <Input v-model="formLeft.input3" placeholder='预计完成时间' style="width:100px"></Input>
            </FormItem>
            <FormItem>
                <Dropdown trigger="click" style="margin-left: 20px" @on-click='selectState'>
                    <a href="javascript:void(0)">
                        {{seleStatus}}
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list" v-for="(o,j) in statusTask" :key="j">
                        <DropdownItem :name="o.name">{{o.name}}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </FormItem>
            <FormItem label="完成备注">
                <textarea v-model="formLeft.input4" placeholder='完成备注' style="width:80%"></textarea>
            </FormItem>
        </Form>
    </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                value2: '1',        //折叠板双向绑定
                detailsTask:[{num: '0',name: '折叠面板1',taskName:'暂无'},],     //全部任务
                modal1: false,      //打开对话框
                formLeft: {
                    input1: '',      //结束时间
                    input2: '',     //任务名称
                    input3: '',     //预计时间
                    input4: '',     //任务完成备注
                },
                paneIndex:'',       //折叠板展开页的索引值
                statusTask:[{name:'未开始'},{name:'进行中'},{name:'已暂停'},{name:'已完成'},{name:'已取消'},{name:'已关闭'}],//任务状态
                seleStatus:'',      //需要改变的状态
                seleStatusId:'',    //改变的状态对应的id
            }
        },
        mounted(){
            this.individualTask();
        },
        methods:{
            /**对话框完成确认提交按钮 */
          ok () {
                let selectData = this.detailsTask[this.paneIndex];
                var that = this;
                if(this.seleStatusId == ''){
                    this.seleStatusId = selectData.status;
                }
                //提交操作
                this.$http.put(this.$store.state.url + '/task/update',{id:selectData.id,status:this.seleStatusId}).then((res) =>{
                    console.log(res)
                    if(res.data.code == '10000'){
                        this.$Message.success('操作成功！')
                        that.individualTask();
                    }
                }).catch((err) =>{
                    console.log(err)
                })
            },
            /**对话框取消按钮 */
            cancel () {
                this.$Message.info('Clicked cancel');
            },
            /**修改按钮 对个人任务状态进行修改操作 */
            activehandel(e){
                let i = this.detailsTask[this.paneIndex].status;
                this.addDate();
                this.formLeft.input2 = this.detailsTask[this.paneIndex].taskName;
                this.formLeft.input3 = this.detailsTask[this.paneIndex].planEndTime;
                this.seleStatus = this.statusTask[i].name;
                this.modal1 = true;
                console.log(this.detailsTask[this.paneIndex])
            },
            /**折叠板展开key */
            panelChange(e){
                console.log(e[0])
                this.paneIndex = e[0];
            },
            /**选择操作当前任务的状态 */
            selectState(name){
                var that = this;
                this.seleStatus = name;
                for(let i=0;i<this.statusTask.length;i++){
                    if(that.statusTask[i].name == name){
                        that.seleStatusId = i;
                    }
                }
            },
            /**标准时间格式转换函数 */
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
                    // return currentdate;
                    console.log(currentdate)
                    this.formLeft.input1 = currentdate;
            },
            /**页面初始化时获取当前用户所有任务 */
            individualTask(){
                var that = this;
                let userId = localStorage.getItem('userId');     //userId是从本地储存的用户id
                this.$http.get(this.$store.state.url + '/task/findByUserId',{params:{userId:userId}}).then((res) =>{
                    if(res.data.code == '10000' && res.data.object[0]){
                        console.log(res)
                        let arr = res.data.object;
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
                                // Object.assign(arr[i], {statusName: '已完成',});
                                arr.splice(i,1);
                            }
                            else if(arr[i].status == 4){
                                arr.splice(i,1);
                            }
                            else if(arr[i].status == 5){
                                arr.splice(i,1);
                            }else if(arr[i].status == 6){
                                arr.splice(i,1);
                            }
                            if(arr[i]){
                                Object.assign(arr[i],{num: i.toString()})
                            }
                        }
                        if(arr.length == 0){
                            console.log(this.detailsTask) 
                            return
                        }
                        this.detailsTask = arr;
                    }
                    else if(res.data.code == '10001'){
                        this.$Message.error('登录超时，请重新登录')
                        this.$router.push('/login');
                    }
                }).catch((err) =>{
                    console.log(err)
                })
            },
        }
    }
</script>
<style lang="less" scoped>
.distrionTast{
  .action{
    float: right;
  }
}
</style>