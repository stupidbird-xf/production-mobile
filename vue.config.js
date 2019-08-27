module.exports = {
  assetsDir: 'pamier',
  indexPath: 'pamier.html',
  devServer: {
    proxy: {
      '/pamier': {
        target: 'http://tdmb.cjiot.cc', //对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/pamier': '/pamier'
        }
      }
    }
  }, 
}