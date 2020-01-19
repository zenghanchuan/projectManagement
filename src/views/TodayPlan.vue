<!--今日计划-->
<template>
<div class="todayPlan">
    <Button class="addTast" type="primary" size="small" @click="show()">新增</Button>
    <Table class="tastTable" border :columns="columns12" :data="data6">
        <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
        </template>
    </Table>
    <Modal
        v-model="modal1"
        title="每日计划修改"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form :model="formLeft" label-position="left">
            <FormItem>
                <Input v-model="formLeft.input1" placeholder='日期' style="width:120px"></Input>
            </FormItem>
            <FormItem>
                <Input v-model="formLeft.input2" placeholder='预计任务量' style="width:120px"></Input>
            </FormItem>
            <FormItem>
                <Input v-model="formLeft.input3" placeholder='任务编号' style="width:120px"></Input>
            </FormItem>
            <FormItem>
                <Input v-model="formLeft.input6" placeholder='实际完成量' style="width:120px"></Input>
            </FormItem>
            <FormItem>
                <textarea v-model="formLeft.input4" placeholder='任务详情' style="width:100%"></textarea>
            </FormItem>
            <FormItem>
                <textarea v-model="formLeft.input5" placeholder='本周总结' style="width:100%"></textarea>
            </FormItem>
        </Form>
    </Modal>
</div>
</template>
<script>
    export default {
        data () {
            return {
                columns12: [
                    {title: '日期',key: 'date'},
                    {title: '预计任务量',key: 'estimate'},
                    {title: '任务编号',key: 'number'},
                    {title: '实际完成量',key: 'actual',},
                    {title: '任务详情',key: 'tastDetail',},
                    { title: '本周总结',key: 'summary',},
                ],
                data6: [
                    {date: '如:2019-12-6',estimate: 7,number: '001,006',actual:'7',tastDetail:'计划描述',summary:'周总结'}],
                modal1: false,  //打开新增对话框
                formLeft: {
                    input1: '', //安排日期
                    input2: '', //预计当天任务数量
                    input3: '', //具体任务编号
                    input4: '', //当天安排的工作详情
                    input5: '', //本周工作总结
                    input6:'',  //当天实际完成量
                },
            }
        },
        mounted(){
            this.addDate();
        },
        methods: {
            /**新增按钮触发事件 */
            show () {
                this.modal1 = true;
            },
            /**对话框表单提交事件*/
            ok () {
                var that = this;
                console.log(this.formLeft.input1)
                this.$http.post(that.$store.state.url + '/plan/createPlan',{createTime:this.formLeft.input1,realTasks:this.formLeft.input6,planTasks:this.formLeft.input2,taskIds:this.formLeft.input3,planDetails:this.formLeft.input4,weekSummary:this.formLeft.input5}).then((res) =>{
                    if(res.data.code == '10000'){
                        this.$Message.success('今日计划上传成功')
                    }else if(res.data.code == '10001'){
                        this.$Message.console.error('登录超时')
                    }
                }).catch((err) =>{
                    console.log(res)
                })
            },
            /**对话框关闭事件 */
            cancel () {
                this.$Message.info('Clicked cancel');
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
        }
    }
</script>
<style lang="less" scoped>
.addTast{
    float: right;
    margin-top: -2%;
}
.tastTable{
    margin-top: 2%;
}
</style>
