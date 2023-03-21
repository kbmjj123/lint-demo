import account from './modules/account';
import home from './modules/home';

const routers = [
	...account,
	...home
];

routers.forEach(item => {
	item.children && item.children.forEach(child => {
		child.getParent = () => {
			return item;
		};
	});
});

export {
	routers
};
