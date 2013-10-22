var mongodb = require('./db');  

function Article(acticle) { 
  this.title = acticle.title; 
  this.content = acticle.content;
  this.username = acticle.username;
}; 

module.exports = Article;  

Article.prototype.save = function save(callback) {   // 存入 Mongodb 的文档 
  var acticle = { 
    title: this.title, 
    content: this.content, 
    username: this.username
  }; 

  mongodb.open(function(err, db) { 
    if (err) { 
      return callback(err); 
    }     
    // 读取 users 集合 
    db.collection('acticles', function(err, collection) { 
      if (err) { 
        mongodb.close(); 
        return callback(err); 
      }      
      // 为 name 属性添加索引 
      collection.ensureIndex({'username':1, 'title':1}, {unique: true});       
      // 写入 user 文档 
      collection.insert(user, {safe: true}, function(err, user) { 
        mongodb.close(); 
        callback(err, user); 
      }); 
    });
  }); 
};  

Article.get = function get(username, callback) { 
  mongodb.open(function(err, db) { 
    if (err) { 
      callback(err); 
    }     
    // 读取 users 集合 
    db.collection('acticles', function(err, collection) { 
      if (err) { 
        mongodb.close(); 
        callback(err); 
      }       
    // 查找 name 属性为 username 的文档 
    var result = [];
    collection.find({username: username}).forEach(function(doc) {
      result.push(doc);
    });
    callback(result); 
  }); 
}; 
