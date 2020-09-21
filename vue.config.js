module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    proxy: {
     '/api': {
       target: "http://localhost:8081/",
       ws: true,  //代理websockets
       changeOrigin: true,// 允许跨域
       pathRewrite: {
         '^/api': '' // 路径重写，使用"/api"代替target.
       }
     }
   }
 },

}