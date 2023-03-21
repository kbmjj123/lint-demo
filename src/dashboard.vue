<style lang="less">
	@import "./style/dashboard.less";
</style>
<template>
	<div class="main">
		<!--左边菜单导航栏start-->
		<div class="sidebar-menu-con" :style="{width: secondMenu.length>1 ? '200px':'90px'}">
			<shrinkable-menu :data="menus" theme="dark" style="width:90px;">
				<div slot="top" class="logo-con">
					<img :src="systemLogo" key="min-logo"/>
				</div>
			</shrinkable-menu>
			<div class="rightMenu" v-if="secondMenu.length>1">
				<div class="menuTit">{{shrinkTitle}}管理</div>
				<nav class="menuNav" v-if="secondMenuTypes.length===0">
					<template v-for="(item, index) in secondMenu">
						<div :key="index" v-if="item.menu">
							<div class="menuSpan"
							     :class="($route.name===item.name||$route.meta.id===item.name)? 'active':''"
							     @click="navTo(item)">{{item.title}}
							</div>
						</div>
					</template>
				</nav>
				<!-- 二级菜单分类 -->
				<nav class="menuNav" v-else>
					<template v-for="p in secondMenuTypes">
						<div class="menuSpanTitle">{{p}}</div>
						<div v-for="(item,index) in secondMenu" :key="p+index">
							<div v-if="item.meta.childGroupName === p">
								<div class="menuSpan"
								     :class="($route.name===item.name||$route.meta.id===item.name)? 'active':''"
								     @click="navTo(item)">{{item.title}}
								</div>
							</div>
						</div>
					</template>
				</nav>
			</div>
		</div>
		<!--左边菜单导航栏end-->
		<!--页面内容区Start-->
		<!-- 如果当前路由是首页则不显示二级菜单 -->
		<div class="single-page-con" :style="{left: secondMenu.length>1?'200px':'90px'}">
			<!--主内容标签页start-->
			<div class="main-header-con" style="padding:0">
				<div class="main-header">
					<div class="header-middle-con">
						<template v-if="secondMenu.length<=1">
							<div class="showName">{{companyName}}</div>
						</template>
						<template v-else>
							<div class="main-breadcrumb">
								<breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
							</div>
						</template>
					</div>
					<div class="header-avator-con">
						<!--						<div class="customer-block zhiCustomBtn">-->
						<!--							<span class="customer-text">客服</span>&nbsp;&nbsp;-->
						<!--							<img style="width:16px;" class="customer-image" src="@/images/customer.png"/>-->
						<!--						</div>-->
						<div class="user-dropdown-menu-con" style="margin-right:20px;">
							<Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
								<Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
									<a href="javascript:void(0)">
										<span class="main-user-name">{{ shopName }}</span>
										<img style="width:16px;vertical-align:middle" src="@/assets/user_icon.png"/>
										<Icon type="arrow-down-b" style="color: #495060;"></Icon>
									</a>
									<DropdownMenu slot="list">
										<DropdownItem name="ownSpace" @click.native="opendChangePasswordModal">修改密码</DropdownItem>
										<DropdownItem name="loginout" divided>退出登录</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</Row>
						</div>
					</div>
				</div>
			</div>
			<!--主内容标签页end-->
			<div class="single-page" ref="single-page">
				<keep-alive>
					<router-view v-if='$route.meta.keepAlive'></router-view>
				</keep-alive>
				<router-view v-if='!$route.meta.keepAlive'></router-view>
			</div>
		</div>
		<!--页面内容区end-->
		<!-- 修改密码 -->
		<Modal v-model="passwordFormMoal" title="修改密码">
			<Form ref="passwordForm" :label-width="120" :rules="formDataRules" :model="formData">
				<FormItem label="旧密码：" prop="oldPassword">
					<Input type="password" v-model="formData.oldPassword" placeholder="请输入旧密码"/>
				</FormItem>
				<FormItem label="新密码：" prop="newPassword">
					<Input type="password" v-model="formData.newPassword" placeholder="请输入新密码，最少6位"/>
				</FormItem>
				<FormItem label="确认密码：" prop="confirmPassword">
					<Input type="password" v-model="formData.confirmPassword" placeholder="请再次输入新密码"/>
				</FormItem>
			</Form>
			<div slot="footer">
				<div style="text-align:center">
					<Button @click="passwordFormMoal=false">取消</Button>&nbsp;&nbsp;&nbsp;&nbsp;
					<Button type="primary" @click="confirmChangePassword">保存</Button>
				</div>
			</div>
		</Modal>
	</div>

</template>
<script>
	import shrinkableMenu from '@/components/dashboard/shrinkable-menu.vue';
	import breadcrumbNav from '@/components/dashboard/bread-crumb-nav.vue';
	import util from '@/utils/util';
	import {routers} from '@/router/router';

	export default {
		components: {
			shrinkableMenu, // 菜单导航
			breadcrumbNav // 面包屑
		},
		data() {
			let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-zA-Z]|[0-9]){6,}$/;
			let passwordData = this.initPasswordData();
			return {
				systemLogo: '',
				companyName: '',
				shopName: this.$cookies.get('account'),
				menus: routers,
				shrinkTitle: '',
				secondMenu: [],
				secondMenuTypes: [],//二级菜单是否有再分类
				isShowName: '',
				currentPath: [],
				passwordFormMoal: false,
				newShrink: true,
				formData: passwordData,
				formDataRules: {
					newPassword: [
						{required: true, message: '新密码不能为空,请使用数字、英文或特殊字符两种及以上！'},
						{pattern: reg, message: '密码至少包含数字、英文或特殊字符其中的两种!'}
					],
					confirmPassword: [
						{required: true, message: '确认密码不能为空,请使用数字、英文或特殊字符两种及以上！'},
						{pattern: reg, message: '密码至少包含数字、英文或特殊字符其中的两种!'}
					],
					oldPassword: [
						{required: true, message: '旧密码不能为空！'}
						// {pattern:reg, message:'密码至少包含数字、英文或特殊字符其中的两种!'}
					]
				}

			};
		},
		computed: {
			avatorPath() {
				return localStorage.avatorImgPath;
			}
		},
		methods: {
			navTo(item) {
				this.currentPath[1] = item;
				this.$router.push({
					name: item.name
				});
			},
			// 初始化密码数据
			initPasswordData() {
				return {
					newPassword: '',
					confirmPassword: '',
					oldPassword: ''
				};
			},
			// 打开修改密码弹窗
			opendChangePasswordModal() {
				this.formData = this.initPasswordData();
				this.passwordFormMoal = true;
			},
			// 提交修改密码
			confirmChangePassword() {
				this.$refs['passwordForm'].validate(vali => {
					if (vali) {
						if (this.formData.confirmPassword !== this.formData.newPassword) {
							this.$Message.error('新密码与确认密码不一致！');
							return false;
						}
						delete this.formData.confirmPassword;
						this.$api.user.changePwd(this.formData).then(res => {
							if (res.result === '000') {
								this.$Message.success('修改成功！');
								this.passwordFormMoal = false;
							}
						});
					}
				});
			},
			handleClickUserDropdown(name) {
				if (name === 'loginout') {
					// 退出登录
					this.$store.commit('LOGOUT', this);
					this.$router.push({
						name: 'login'
					});
				}
			},
			initMenuSelected(route) {
				const secondMenuItem = util.getRouterObjByName(route.name);
				const firstMenuItem = secondMenuItem && secondMenuItem.getParent && secondMenuItem.getParent();

				let menus = [];
				if (firstMenuItem) {
					this.shrinkTitle = firstMenuItem.title;
					firstMenuItem.children && firstMenuItem.children.forEach(item => {
						if (item.accessList === undefined || (item.accessList)) {
							menus.push(item);
						}
					});

					// 过滤要显示菜单的列表
					menus = menus.filter(item => item.menu === true)

					this.secondMenuTypes = this.sortSecondMenu(menus)

					this.secondMenu = menus;
					this.currentPath = [firstMenuItem, secondMenuItem];
					this.calculateWH();
				}
			},
			// 计算出当前可展示视图的宽高
			calculateWH() {
				this.$nextTick(() => {
					let pageContent = this.$refs && this.$refs['single-page'];
					let screenW = window.screen.availWidth;
					let screenH = document.documentElement.clientHeight || document.documentElement.clientHeight;
					if (pageContent) {
						let left = pageContent.getBoundingClientRect().left + 12;
						let top = pageContent.getBoundingClientRect().top;
						this.$store.commit('cacheIFrameWH', {
							width: screenW - left,
							height: screenH - top - window.screen.availTop
						});
					}
				});
				// this.$refs['single-page']
			},
			// 获取二级菜单再分类的类型
			sortSecondMenu(menuArr) {
				let types = [];
				for (let i = 0; i < menuArr.length; i++) {
					if (menuArr[i].meta && menuArr[i].meta.childGroupName) {
						if (!types.includes(menuArr[i].meta.childGroupName)) {
							types.push(menuArr[i].meta.childGroupName)
						}
					}
				}

				if (types.length >= 2) {
					return types
				} else {
					return []
				}
			},
		},
		watch: {
			'$route'(to) {
				this.initMenuSelected(to);
			}
		},
		created() {
			this.initMenuSelected(this.$route);
		},
		mounted() {

		}
	};
</script>
