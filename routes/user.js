
/*
 * GET users listing.
 */

var User = require('../models/user');

exports.list = function(req, res) {
  res.send("respond with a resource");
};

exports.user = function(req, res) {
	User.get(req.params.user, function(err, user) {
		if (!user) {
			req.flash('error', '用户不存在'); return res.redirect('/');
		}
		res.render('user',{
			title:user.name,
			info:user
		});
	});
};