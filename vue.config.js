module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      '/backapi': {
        target: 'http://39.100.122.95:8080/code_test_manager',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/backapi': '/backapi'
        },
      },
    }
  }, 
}