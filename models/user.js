var pg = require('pg');

function User(id, firstName, lastName, email) {
	this.id = id;
	this.firstName = firstName.trim();
	this.lastName = lastName.trim();
	this.email = email.trim();
	this.password;
};

User.prototype.save = function(callback) {
	var self = this;
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    	client.query(
      		'INSERT INTO p_user (email, firstName, lastName, password) values ($1, $2, $3, $4) RETURNING id;',
      		[self.email, self.firstName, self.lastName, self.password],
      		function(err, result) {
      			done();
          		self.id = result.rows[0]['id'];
      			callback(err, self);
      		}
    	);
  	});
}

User.get = function(id, callback) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query('SELECT * FROM p_user where id = $1',
	                 [id],
	                 function(err, result) {
					      done();
						      if (err) { 
						        callback(err, null, null);
						      } else { 
						        if (result.rows.length == 0) {
						          callback(new Error('no users found'), null, null)
						        } else { 
						        	var data = result.rows[0];
						          	var user = new User(data['id'], data['firstname'], data['lastname'], data['email']);
						          	callback(null, user, data['password']);
						        }
						      }
					   	});
	  });
}

module.exports = User;