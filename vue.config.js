module.exports = {
  lintOnSave: false,
  chainWebpack: (config) => {
    config.output
      .filename('js/[name].[hash:8].js')
      .chunkFilename('js/[name].[hash:8].js');
  },
  devServer: {
    disableHostCheck: true,
    port: 80,
    proxy: {
      "^/ssh": {
        target: "http://webssh:2222",
        changeOrigin: true,
        secure:false,
        pathRewrite: {'^/ssh': '/ssh'},
        logLevel: 'debug'
      },
    },
  },
};
