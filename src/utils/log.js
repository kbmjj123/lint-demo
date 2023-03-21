
import {debug} from '@/config';
import loglevel from 'loglevel';

const logger = loglevel.getLogger('zd_log');	// 公共的日志打印对象
if(!debug){
	logger.disableAll(true);
}else{
	logger.enableAll(true);
}
export default {
	log(message){
		logger.log(message);
	},
	info(message){
		logger.info(message);
	},
	error(message){
		logger.error(message);
	},
	trace(message){
		logger.trace(message);
	}
}
