const path = require('path');
module.exports = {
    publicPath: '/',
    // outputDir: 'dist',
    // indexPath: "index.html",
    devServer: {
        port: 9004,     // 端口
    },
    lintOnSave: false,   // 取消 eslint 验证
    configureWebpack:{  // 覆盖webpack默认配置的都在这里
        resolve:{   // 配置解析别名
            alias:{
                '@':path.resolve(__dirname + './dist/index.html'),
                // '@h':path.resolve(__dirname, './src/assets/hotcss'),
                // '@s':path.resolve(__dirname, './src/assets/style'),
                // '@i':path.resolve(__dirname, './src/assets/images'),
            } 
        }
    }
};