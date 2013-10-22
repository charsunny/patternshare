
/*
 * GET home page.
 */
var User = require('../models/user');
var crypto = require('crypto');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.post = function(req, res) {
	res.render('post', {title:'发布分享'});
};  

exports.reg = function(req, res) { 
	res.render('reg', { title: '用户注册' });
};  

exports.doReg = function(req, res) { 
	if(req.body['password-repeat'] != req.body['password']) {
		console.log(req.body['password-repeat']);
	    req.flash('error', '两次输入的口令不一致');
	    return res.redirect('/reg'); 
  	} 
	//生成口令的散列值  
	var md5 = crypto.createHash('md5'); 
	var password = md5.update(req.body.password).digest('base64'); 
	   
	var newUser = new User({ 
	    name: req.body.username, 
	    email: req.body.email,
	    password: password
	}); 
	//检查用户名是否已经存在   
	User.get(newUser.name, function(err, user) { 
	    if (user) 
	      err = 'Username already exists.'; 
	    if (err) { 
	      req.flash('error', err); 
	      return res.redirect('/reg'); 
	    }     //如果不存在则新增用户 
	    newUser.save(function(err) { 
	      if (err) { 
	        req.flash('error', err); 
	        return res.redirect('/reg'); 
	      } 
	      req.session.user = newUser;       
	      req.flash('success', '注册成功');      
	      res.redirect('/'); 
	    }); 
	});
};  

exports.login = function(req, res) { 
	res.render('login', {title: '用户登入'}); 
};  

exports.doLogin = function(req, res) { 
	//生成口令的散列值 
  var md5 = crypto.createHash('md5'); 
  var password = md5.update(req.body.password).digest('base64'); 
   
  User.get(req.body.username, function(err, user) { 
    if (!user) {       
    	req.flash('error', '用户不存在'); 
      	return res.redirect('/login'); 
    } 
    if (user.password != password) {
        req.flash('error', '用户口令错误');
        return res.redirect('/login'); 
    } 
    req.session.user = user;
    req.flash('success', '登入成功');
    res.redirect('/'); 
  }); 
};  

exports.logout = function(req, res) {
	req.session.user = null;   
	req.flash('success', '登出成功'); 
  	res.redirect('/'); 
}; 

