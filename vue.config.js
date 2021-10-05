module.exports = {
  publicPath: '/devops/',
  lintOnSave: false,
  chainWebpack: (config) => {
    config.output
      .filename('js/[name].[hash:8].js')
      .chunkFilename('js/[name].[hash:8].js');
  },
  devServer: {
    public: '0.0.0.0',
    sockPath: '/devops/sockjs-node',
    port: 80,
    disableHostCheck: true,
  },
};
