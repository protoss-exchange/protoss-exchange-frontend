const CracoLess = require("craco-less");
module.exports = {
  eslint: {
    enable: false
  },
  devServer: {
    port: 3030
  },
  plugins: [
    {
      plugin: CracoLess,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
              "@popover-background": 'rgb(23, 30, 46)'
            }
          }
        }
      }
      // options: {
      //   customizeTheme: {
      //     // '@popover-background': 'red'
      //   }
      // }
    }
  ]
}