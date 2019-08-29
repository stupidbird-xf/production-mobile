module.exports = {
  publicPath: './',
  devServer: {
    port: 8081,
    proxy: {
      '/backapi': {
        target: 'http://39.100.122.95:8080/code_test_manager', //对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/backapi': '/backapi'
        },
      }
    }
  },
}