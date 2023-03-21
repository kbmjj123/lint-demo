const app = {
    state: {
        cachePage: [],
        lang: '',
        isFullScreen: false,
        menuTheme: 'dark', // 主题
        themeColor: '',
        messageCount: 0,
        dontCache: ['text-editor', 'artical-publish'], // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
        iFrameWH: {}    // 缓存的内嵌视图的宽度+高度
    },
    mutations: {
        cacheIFrameWH(state, iFrameWH){
            state.iFrameWH = iFrameWH;
        },
        changeMenuTheme (state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme (state, mainTheme) {
            state.themeColor = mainTheme;
        },
        closePage (state, name) {
            state.cachePage.forEach((item, index) => {
                if (item === name) {
                    state.cachePage.splice(index, 1);
                }
            });
        },
        initCachepage (state) {
            if (localStorage.cachePage) {
                state.cachePage = JSON.parse(localStorage.cachePage);
            }
        }
    }
};

export default app;
