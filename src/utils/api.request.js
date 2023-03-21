/**
 * @date 2019-11-01
 * @auth xuyongsen
 * @desc 封装异步请求
 */
import HttpRequest from '@/utils/fetch'
import config from '@/config'
import {Message} from 'view-design';

const axios = new HttpRequest({baseUrl: config.baseUrl});

let canRun = true, errorTimeout = null;

function errorToast(desc) {
	errorTimeout = null;
	if (canRun) {
		// console.log(desc,'desc')
		Message.error(desc || '网络或服务器异常，请稍后再试！');
		canRun = false;
		errorTimeout = setTimeout(function () {
			canRun = true;
		}, 1000);
		return Promise.reject(new Error(desc || 'Error'))
	}

	// console.log('网络或服务器异常，请稍后重试！')
	// iView.Message.error('网络或服务器异常，请稍后重试！');
}

export default {
	postJson(url, params) {
		return new Promise((resolve, reject) => {
			axios.request({
				url: url,
				data: params,
				method: 'post'
			})
				.then(res => {
					const {data, isType} = res
					// console.log(res,'请求拦截')
					if (data.result === '000' || isType) {
					} else {
						errorToast(data.desc)
					}
					resolve(data)
				})
				.catch(err => {
					errorToast();
					reject(err);
				})
		})
	},
	getJson(url, params) {
		return new Promise((resolve, reject) => {
			axios.request({
				url: url,
				data: params,
				method: 'get'
			}).then(res => {
				const {data, isType} = res
				// console.log(res,'请求拦截')
				if (data.result === '000' || isType) {
				} else {
					errorToast(data.desc)
				}
				resolve(data)
			}).catch(err => {
				errorToast();
				reject(err);
			})
		})
	},
	exportFile(url, data) {
		return new Promise((resolve, reject) => {
			axios.request({
				url: url,
				data,
				method: 'post',
				responseType: 'blob'
			}).then(res => {
				const {data, isType} = res
				// console.log(res,'请求拦截')
				if (data.result === '000' || isType) {

				} else {
					errorToast(data.desc)
				}
				resolve(data)
			}).catch(err => {
				errorToast();
				reject(err)
			})
		})
	}
}
