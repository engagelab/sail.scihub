var sail = require('./js/sail.js/sail.node.server.js')

global.bosh.server = 'imediamac28.uio.no'
global.rollcall.server = 'imediamac28.uio.no'
global.rollcall.port = 8080
global.mongoose.server = 'imediamac28.uio.no' 

sail.server.start(8000)
