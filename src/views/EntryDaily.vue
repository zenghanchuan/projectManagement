<!--个人日报录入-->
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
                <Input v-model="formLeft.input1" placeholder='日期' disabled style="width:120px"></Input>
            </FormItem>
            <FormItem>
                <Input type="number"  min="0.00" max="100.00" step="0.01" v-model="formLeft.input2" placeholder='预计任务量' style="width:120px"></Input>
            </FormItem>
            <FormItem>
                <Input type="number"  min="0.00" max="100.00" step="0.01" v-model="formLeft.input3" placeholder='实际完成量' style="width:120px"></Input>
            </FormItem>
            <FormItem>
                <Input type="number"  min="0.00" max="100.00" step="0.01" v-model="formLeft.input6" placeholder='超额完成量' style="width:120px"></Input>
            </FormItem>
            <FormItem>
                <Input type="number"  min="0.00" max="100.00" step="0.01" v-model="formLeft.input4" placeholder='未完成量' style="width:120px"></Input>
            </FormItem>
            <FormItem>
                <textarea v-model="formLeft.input5" placeholder='简报内容' style="width:100%"></textarea>
            </FormItem>
        </Form>
    </Modal>
</div>
</template>
<script>
import server from '../../server';
    export default {
        data () {
            return {
                columns12: [
                    {title: '日期',key: 'date'},
                    {title: '预计任务量',key: 'estimate'},
                    {title: '实际完成量',key: 'actual',},
                    {title: '未完成量',key: 'incomplete',},
                    {title: '超额完成量',key: 'excess',},
                    {title: '简报内容',key: 'sumWork',},
                    // { title: '',key: 'summary',},
                ],
                data6: [
                    {date: '如:2019-12-6',estimate: 7,incomplete: '1',actual:'6',excess:'1',sumWork:'简报内容'}],
                modal1: false,  //打开新增对话框
                formLeft: {
                    input1: '', //安排日期
                    input2: '', //预计当天任务数量
                    input3: '', //当天实际完成量
                    input4: '', //当天未完成量
                    input5: '', //简报内容
                    input6:'',  //当天超额完成量/briefing/create  /update  /indByUserIdAndDate  
                },
            }
        },
        mounted(){
            this.formLeft.input1 = server.addDate();
        },
        methods: {
            /**新增按钮触发事件 */
            show () {
                this.modal1 = true;
            },
            /**对话框表单提交每日日报事件*/
            ok () {
                var that = this;
                if(this.formLeft.input2 == '' || this.formLeft.input3 == '' || this.formLeft.input4 == '' || this.formLeft.input6 == '' || this.formLeft.input5 == ''){
                    this.$Message.error('信息不完整')
                    return;
                }else{
                    if(server.regular(that.formLeft.input2) == 1 || server.regular(that.formLeft.input3) == 1 || server.regular(that.formLeft.input4) == 1 || server.regular(that.formLeft.input6) == 1){
                        that.formLeft.input2 = '',that.formLeft.input3 = '',that.formLeft.input4 = '',that.formLeft.input6 = '';
                        this.$Message.error('数据格式错误')
                        return
                    }
                        var userId = localStorage.getItem('userId');
                        that.$http.post(that.$store.state.url + '/briefing/create',{planNum:that.formLeft.input2,realNum:that.formLeft.input3,excessNum:that.formLeft.input6,undoneNum:that.formLeft.input4,userId:userId,briefingDescription:that.formLeft.input5,creatTime:that.formLeft.input1}).then((res) =>{
                            if(res.data.code == '10000'){
                                console.log(res)
                                this.$Message.success('日报录入成功')
                            }else if(res.data.code == '10001'){
                                this.$Message.error('登录超时')
                            }else if(res.data.code == '10009'){
                                this.$Message.error('请勿重复录入')
                            }
                        }).catch((err) =>{
                            console.log(res)
                        })
                    }
            },
            /**修改简报 */
            // updateDay(){
            //     var that = this;
            //     var userId = localStorage.getItem('userId');
            //     this.$http.put(that.$store.state.url + '/briefing/update',{id:'3',planNum:this.formLeft.input2,realNum:this.formLeft.input3,excessNum:this.formLeft.input6,undoneNum:this.formLeft.input4,userId:userId,briefingDescription:this.formLeft.input5,creatTime:this.formLeft.input1}).then((res) =>{
            //         if(res.data.code == '10000'){
            //             console.log(res)
            //             this.$Message.success('今日日报录入成功')
            //         }else if(res.data.code == '10001'){
            //             this.$Message.console.error('登录超时')
            //         }
            //     }).catch((err) =>{
            //         console.log(res)
            //     })
            // },
            /**对话框关闭事件 */
            cancel () {
                this.$Message.info('已点击取消');
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
