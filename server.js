var sail = require('./js/sail.js/sail.node.server.js')

global.bosh.server = 'imediamac28.uio.no'

global.rollcall.server = 'imediamac28.uio.no'
global.rollcall.port = 8080

global.mongoose.server = 'imediamac28.uio.no'

// 
// Trying to proxy youtube/google requests. Doesn't work though :(
// 
// 
// var httpProxy = require('http-proxy')
// var proxy = new httpProxy.HttpProxy()
// var url = require('url')
// 
// global.proxyMap.unshift(
//     {
//         name: 'YouTube',
//         match: function(req) { return req.url.match(/\?youtube/) },
//         proxy: function(req, res) {
//             console.log("PROXY YOUTUBE "+req.url+" ==> "+req.url)
//             proxy.proxyRequest(req, res, {
//                 host: 'www.youtube.com',
//                 port: 80
//             })
//         }
//     },
//     
//     {
//         name: 'Google Auth',
//         match: function(req) { return req.url.match("/accounts/ClientLogin") },
//         proxy: function(req, res) {
//             console.log("PROXY GOOGLE "+req.url+" ==> "+req.url)
//             proxy.proxyRequest(req, res, {
//                 host: 'www.google.com',
//                 port: 443
//             })
//         }
//     }
// )

sail.server.start(8000)
