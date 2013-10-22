var mongodb = require('./db');  

function Comment(comment) { 
  this.username = comment.username; 
  this.content = comment.content; 
  //this.comments = comment.comments;
}; 

module.exports = Comment;  

Comment.prototype.save = function save(callback) {   // 存入 Mongodb 的文档 
  var comment = { 
    username: this.username, 
    content: this.content, 
    //comments: this.comments
  }; 
  mongodb.open(function(err, db) { 
    if (err) { 
      return callback(err); 
    }     
    // 读取 users 集合 
    db.collection('comments', function(err, collection) { 
      if (err) { 
        mongodb.close(); 
        return callback(err); 
      }            
      // 写入 user 文档 
      collection.insert(comment, {safe: true}, function(err, user) { 
        mongodb.close(); 
        callback(err, comment); 
      }); 
    });
  }); 
};  

Comment.get = function get(username, callback) { 
  mongodb.open(function(err, db) { 
    if (err) { 
      return callback(err); 
    }     
    // 读取 users 集合 
    db.collection('users', function(err, collection) { 
      if (err) { 
        mongodb.close(); 
        return callback(err); 
      }       
      // 查找 name 属性为 username 的文档 
      collection.findOne({name: username}, function(err, doc) { 
        mongodb.close(); 
        if (doc) {           // 封装文档为 User 对象 
          var user = new User(doc); 
          callback(err, user); 
        } else { 
          callback(err, null); 
        } 
      }); 
    }); 
  }); 
}; 
