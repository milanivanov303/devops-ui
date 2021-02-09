module.exports = {
  publicPath: '/devops/',
  lintOnSave: false,
  chainWebpack: (config) => {
    config.output
      .filename('js/[name].[hash:8].js')
      .chunkFilename('js/[name].[hash:8].js');
  },
  devServer: {
    sockPath: '/devops/sockjs-node',
    disableHostCheck: true,
    port: 80,
    proxy: {
      '^/ssh': {
        target: 'http://webssh2',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/ssh': '/ssh' },
        logLevel: 'debug',
      },
    },
  },
};
