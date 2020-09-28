module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    proxy: {
     '/': {
       target: "http://10.61.166.57:8081/",
       ws: true,  //代理websockets
       changeOrigin: true,// 允许跨域
       pathRewrite: {
         '^/': '/' // 路径重写，使用"/api"代替target.
       }
     }
   }
 },

}