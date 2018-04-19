var config = {};

config.mongoosePass = 'admin';
config.mongooseUser = 'admin';
config.mongoosePort = '21309';
config.mongooseURL = ('mongodb://'+config.mongooseUser+':'+config.mongoosePass+'@ds121309.mlab.com:'+config.mongoosePort+'/maat-it');


module.exports = config;

