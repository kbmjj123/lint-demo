<template>
  <div class="login-con main">
    <Row>
      <Col :span="18" :offset="3">
        <div class="nav-header">
          <img class="logo" :src="systemLogo" />
          <span class="company-title">
            <span>{{ systemShortName }}</span>
            <span class="point">.</span>
            <span style="font-weight: 400">管理系统</span>
          </span>
        </div>
      </Col>
    </Row>
    <Row class="main-box">
      <img
        src="https://img2.zhidianlife.com/image/2021/01/11/36f3c045-0a4c-4ab9-9e91-725325deadfc.jpeg"
        class="bg"
      />
      <Card :bordered="false" class="login-box">
        <div slot="title" class="register">
          <span class="register-title">用户登录</span>
          <Button
            style="float: right"
            size="small"
            @click="enter"
            class="register-btn"
            >注册新用户
          </Button>
        </div>
        <div class="form-con">
          <Form ref="loginForm" :model="form">
            <div class="input-group">
              <FormItem prop="phone">
                <Input
                  size="large"
                  v-model="form.phone"
                  @on-enter="handleSubmit"
                  placeholder="请输入用户名"
                >
                  <span slot="prepend">
                    <img src="@/assets/ic_account.png" class="prefix-icon" />
                  </span>
                </Input>
              </FormItem>
              <FormItem prop="password">
                <Input
                  size="large"
                  type="password"
                  @on-enter="handleSubmit"
                  v-model="form.password"
                  placeholder="请输入密码"
                >
                  <span slot="prepend">
                    <img src="@/assets/ic_password.png" class="prefix-icon" />
                  </span>
                </Input>
              </FormItem>
              <FormItem prop="verifyCode">
                <Input
                  size="large"
                  @on-enter="handleSubmit"
                  v-model="form.verifyCode"
                  :maxlength="4"
                  placeholder="请输入验证码"
                >
                  <span slot="prepend" style="width: 35px">
                    <img src="@/assets/ic_pic_random.png" class="prefix-icon" />
                  </span>
                  <span slot="append">
                    <img
                      :src="imgCode"
                      class="imgCode"
                      style="cursor: pointer"
                      @click="getImgCode"
                    />
                  </span>
                </Input>
              </FormItem>
            </div>
            <FormItem style="margin: 5px 0px">
              <a @click="forgetPassword" href="javascript:">忘记密码？</a>
            </FormItem>
            <FormItem>
              <Button
                @click="handleSubmit"
                type="primary"
                long
                :loading="loading"
              >
                <span v-if="loading">登录中</span>
                <span v-else>登录</span>
              </Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </Row>
    <!--    <Row class="company-msg">-->
    <!--      <ul class="link-list">-->
    <!--        <li class="link-item"><a target="view_window"-->
    <!--                                 href="http://group.zhidianlife.com/index.html">集团介绍</a></li>-->
    <!--        <li class="link-item"><a target="view_window"-->
    <!--                                 href="http://group.zhidianlife.com/a/lianxiwomen/">联系我们</a></li>-->
    <!--        <li class="link-item"><a target="view_window"-->
    <!--                                 href="http://group.zhidianlife.com/a/chanpinbuju/">蜘点生态</a></li>-->
    <!--        <li class="link-item"><a target="view_window" href="http://www.zhidianlife.com/">蜘点商城</a>-->
    <!--        </li>-->
    <!--        <li class="link-item"><a href="javascript:"-->
    <!--                                 @click="$router.push({name:'register'})">商家入驻</a></li>-->
    <!--        <li class="link-item"><a target="view_window"-->
    <!--                                 href="http://group.zhidianlife.com/a/lianxiwomen/">帮助中心</a></li>-->
    <!--      </ul>-->
    <!--      <p>粤ICP备17158130号-1</p>-->
    <!--      <p>Copyright©&nbsp;蜘点集团，All Rights Reserved</p>-->
    <!--    </Row>-->
  </div>
</template>
<script>
import config from '@/config'

export default {
  data() {
    return {
      systemLogo: config.systemInfo.systemLogo,
      systemShortName: config.systemInfo.systemShortName,
      loading: false,
      imgCode: '',
      form: {
        phone: '',
        password: '',
        verifyCode: '',
      },
    }
  },
  created() {
    let userAccount = this.$cookies.get('userAccount')
    let userPassword = this.$cookies.get('userPassword')

    this.form.phone = userAccount && this.$util.decrypt(userAccount)
    this.form.password = userPassword && this.$util.decrypt(userPassword)
  },
  methods: {
    getImgCode() {
      // this.$api.user
      // 	.getVerifyImg({
      // 		width: 60,
      // 		height: 20,
      // 	})
      // 	.then((res) => {
      // 		if (res.result === "000") {
      // 			this.imgCode = res.data;
      // 			this.form.verifyCode = "";
      // 		}
      // 	});
    },
    handleSubmit() {
      if (this.form.phone === '') {
        this.$Message.error('账号不能为空')
        return false
      }
      if (this.form.password === '') {
        this.$Message.error('密码不能为空')
        return false
      }
      if (this.form.verifyCode === '') {
        this.$Message.error('验证码不能为空')
        return false
      }
      this.loading = true
      this.$cookies.set('token', '123')
      this.$router.push('/home')
    },
    // 忘记密码
    forgetPassword() {},
    // 新用户注册
    enter() {},
  },
}
</script>

<style lang="less" scoped>
.login-con {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;

  /deep/ .ivu-input-group-append {
    padding: 0px !important;

    img {
      width: 70px;
      height: 100%;
    }
  }

  /deep/ .ivu-card-head {
    border-bottom: 0px !important;
    padding: 14px 16px !important;
    padding-bottom: 0px !important;
  }

  /deep/ .ivu-card {
    transition: none !important;
  }

  /deep/ .ivu-card:hover {
    box-shadow: none !important;
  }
}

.nav-header {
  padding: 18px 0px;

  .logo {
    width: 40px;
    vertical-align: middle;
    margin-right: 15px;
  }

  .company-title {
    color: #de3428;
    vertical-align: middle;
    font-size: 25px;
    font-weight: 600;

    .point {
      vertical-align: 7px;
      line-height: 20px;
    }
  }
}

.main-box {
  position: relative;

  .bg {
    width: 100%;
  }

  .login-box {
    position: absolute;
    left: 70%;
    top: 50%;
    transform: translateY(-50%);
    width: 300px;
  }
}

.register-title {
  display: inline-block;
  height: 25px;
  line-height: 25px;
}

.register-btn {
  color: #57a3f3 !important;
  background-color: transparent !important;
  border-color: #57a3f3 !important;
}

.input-group {
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid #ddd !important;

  /deep/ .ivu-input-group-large {
    border-bottom: 1px solid #ddd !important;
  }

  /deep/ .ivu-input-group-prepend {
    border-radius: 0px !important;
  }

  /deep/ .ivu-input {
    border-radius: 0px !important;
    border: 0px;
  }

  /deep/ .ivu-form-item {
    margin-bottom: 0px !important;
  }

  /deep/ .ivu-input-group-prepend,
  /deep/ .ivu-input-group-append {
    background-color: #fff !important;
    border: 0px !important;
  }

  .prefix-icon {
    width: 28px;
    height: 28px;
    padding: 4px;
  }
}

.link-list {
  display: inline-block;
  margin: 25px 0;

  .link-item {
    width: 90px;
    height: 14px;
    line-height: 14px;
    border-right: 1px solid #555;
    text-align: center;
    float: left;

    a {
      color: #495060;
    }
  }

  .link-item:last-child {
    border-right: 0px;
  }
}

.company-msg {
  text-align: center;

  p {
    padding: 3px 0px;
  }
}
</style>
