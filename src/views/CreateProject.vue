<template>
  <div class="createProject">
    <h2>项目新增</h2>
    <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
        <FormItem label="项目名称" prop="passwd">
            <Input type="text" v-model="formCustom.passwd"></Input>
        </FormItem>
        <FormItem label="项目代号" prop="passwdCheck">
            <Input type="text" v-model="formCustom.passwdCheck"></Input>
        </FormItem>
        <FormItem label="功能模块" prop='teamName'>
            <Input type="text" v-model="formCustom.teamName"></Input>
        </FormItem>
        <FormItem label="项目负责" prop='director'>
            <Input type="text" v-model="formCustom.director"></Input>
        </FormItem>
        <FormItem label="起始时间" prop='duration'>
            <!-- <Input type="text" v-model="formCustom.duration"></Input> -->
            <Row>
                <Col span="12">
                    <DatePicker type="daterange" @on-change="changeData" format="yyyy-MM-dd" confirm placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
                </Col>
            </Row>
        </FormItem>
        <FormItem label="团队成员" prop='member'>
            <Input type="text" v-model="formCustom.member"></Input>
        </FormItem>
        <FormItem label="项目描述" prop='describe'>
            <Input type="text" v-model="formCustom.describe"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formCustom')">提交</Button>
            <Button @click="handleReset('formCustom')" style="margin-left: 8px">清空</Button>
        </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  data () {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请填写项目名称'));
                } else {
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请填写你的项目代号'));
                } 
                else {
                    callback();
                }
            };
            const validateTeamName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请填写此项目名称'));
                    // callback(new Error('请填写团队名称'));
                }
            };
            return {
                formCustom: {
                    passwd: '',//项目名称
                    passwdCheck: '',//项目代号
                    teamName: '',//功能模块
                    director:'',//项目负责人
                    duration:'',//起始时间
                    describe:'',//项目描述
                    member:'',//项目成员
                },
                startTime:'',
                endTime:'',
                ruleCustom: {
                    passwd: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    // teamName: [
                    //     { validator: validateTeamName, trigger: 'blur' }
                    // ]
                }
            }
        },
        methods: {
            /**创建项目提交点击事件 */
            handleSubmit (name) {
                var that = this;
                console.log(666)
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        /**创建接口 */
                      that.$http.post(that.$store.state.url + '/project/createProject',{projectName:this.formCustom.passwd,projectOrganizer:this.formCustom.director,projectStartTime:this.startTime,projectEndTime:this.endTime,projectModular:this.formCustom.teamName,projectMember:this.formCustom.member,projecDescription:this.formCustom.describe,status:'0'}).then((res) =>{
                          console.log(res)
                          if(res.data.code == '10000'){
                              this.$Message.success('创建成功!');
                              this.$refs[name].resetFields();
                          }
                      }).catch((err) =>{
                          console.log(err)
                          if(res.data.code == '10001'){
                              this.$Message.error('登录超时请重新登录!');
                              this.$router.push('/login')
                          }
                      })
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('必填处不能为空!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            changeData(e){
                console.log(e)
                if(e){
                    this.startTime = e[0];
                    this.endTime = e[1];
                }
            },
        }
}
</script>
<style lang="less" scoped>
.createProject{
  width: 80%;
  h2{
    margin: 2vh 0 0 2vh;
  }
  Form{
    width: 40%;
    margin: 5vh 0 0 40vh;
  }
}
</style>
