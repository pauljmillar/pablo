
var Klass = require('./models/klass');
var Assignment = require('./models/assignment');
var User = require('./models/user');
var StudentKlass = require('./models/studentklass');
var StudentAssignment = require('./models/studentassignment');
var KlassAssignmentGroup = require('./models/klassassignmentgroup');
var AssignmentGroup = require('./models/assignmentgroup');
//var AssignmentGroupAssignment = require('./models/assignmentgroupassignment');
var  nodemailer = require('nodemailer');
var ObjectId = require('mongodb').ObjectId;
var shortid = require('shortid');

module.exports = function(app, passport) {

	// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index.html');
	});



	// CLASS SECTION 2========================= moved to angular route
	//app.get('/class/:classId', isLoggedIn, function(req, res) {
	//    res.render('class.html', {
	//        user : req.user
	//    });
	//});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		//req.logout();
		//res.redirect('/login');
		req.session.destroy(function(err) {
			res.redirect('/login'); //Inside a callback… bulletproof!
		});
	});


	// API routes===========================================

	// get userid
	app.get('/api/userid', function(req, res) {
		//console.log(req.user.id);
		var usr;// = req.user.id;
		//if (!req.user) 
		//	req.user = {id:'58fe458964b64e791bbecd90', _id:'58fe458964b64e791bbecd90', fname:'Welcome', username:'demo1', email:'demo@demo.com', local: {email:'demo@demo.com'}, default: 'default'};
			//user = {id:'58fe458964b64e791bbecd90', fname:'Welcome', email:'demo@demo.com'};
			  //passport.serializeUser(function(user, done) {
        //	done(null, user.id);
    		//});
			

		//console.log('userid:'+req.user.id);

		res.send(req.user);
	});

	// get all users - for testing
	app.get('/api/users', function(req, res) {
		User.find().sort({
			_id: -1
		}).exec(function(err, users) {

			if (err) {return res.send(err);}


			console.log(JSON.stringify(users));
			res.json(users);
		});
	});

	// lightweight, called by profile form while typing----------------------------------------=
	app.get('/api/user/username/:username', function(req, res) {
			User.findOne({ 'username':req.params.username }, { 'username': 1}).exec(function(err,docs){
					if (err) {return res.send(err);}

    			res.json(docs);
	   		});
	});	
	
	// update userinfo
	app.put('/api/user/:user_id', function(req, res) {

		// use our klass model to find the bear we want
		User.findById(req.params.user_id, function(err, user) {

			if (err) {return res.send(err);}


			user.firstName = req.body.firstName;
			user.lastName = req.body.lastName;
			user.userType = req.body.userType;
			user.local.email = req.body.email;
			user.username = req.body.username;
			user.avatar = req.body.avatar;
			user.isPrivate = req.body.isPrivate;
			user.isPremium = req.body.isPremium;
			
			console.log(JSON.stringify(user));


			user.save(function(err) {
				if (err) {return res.send(err);}
				
				//now update username in any klass record
				Klass.findOneAndUpdate({
					teacherId: req.params.user_id
				}, {
					$set: {
						username: req.body.username
					}
				}, function(err, doc2) {
						if (err) {return res.send(err);}
				
						res.json({ message: 'User updated!' });

				});

			});

		}); 
	});


	// get all assignments - for testing
	app.get('/api/assignments/test', function(req, res) {
		Assignment.find().sort({
			_id: -1
		}).exec(function(err, assn) {

			if (err) {return res.send(err);}


			console.log(JSON.stringify(assn));
			res.json(assn);
		});
	});

	//get all studentklasses for testing
	app.get('/api/studentklass/test', function(req, res) {

		StudentKlass.find({})
			.sort({
				_id: -1
			})
			.populate('klassId')
			.populate('studentId')
			.exec(function(err, klasses) {

				if (err) {return res.send(err);}


				res.json(klasses);
			});
	});

	// ============================================================================
	// STUDENTASSIGNMENT MODEL
	// =============================================================================

	// get all studentassignment records - for testing
	app.get('/api/studentassignments', function(req, res) {
		StudentAssignment.find()
			.sort({
				_id: -1
			})
			.exec(function(err, studentassignments) {

				if (err) {return res.send(err);}


				console.log(JSON.stringify(studentassignments));
				res.json(studentassignments);
			});
	});

	// get  details of single STUDENT assignment
	 app.get('/api/studentassignment/:assignment_id', function(req, res) {
	     StudentAssignment.findOne({ _id: req.params.assignment_id })
			 		.populate({ path: 'assignmentId',
    					populate: { path: 'comments.author' }
  				})
					.exec(function(err, assignment){

						if (err) {return res.send(err);}

					
				 				console.log('studentAssignment record************');
								console.log(assignment);
	           res.json(assignment);
        });
    });
	
	// get  studentassignment records for klassid and studentid
	app.get('/api/studentassignments/student/:student_id', function(req, res) {

		var cutoff = new Date();

		// StudentKlass.find({ studentId: req.params.student_id })
		StudentAssignment.find({
				studentId: req.params.student_id
			})
			.sort({
				_id: -1
			})
			//.populate('assignmentId', 'assignmentId.comments.author')
			.populate({
				path: 'assignmentId'
			})
			.exec(function(err, assignments) {

			if (err) {return res.send(err);}


				res.json(assignments);
			});
	});

	// get ALL studentassignment records for studentid
	app.get('/api/studentassignments/all', function(req, res) {
		if (!req.user) 
			req.user = {id:'58fe458964b64e791bbecd90', _id:'58fe458964b64e791bbecd90', fname:'Welcome', email:'demo@demo.com', local: {email:'demo@demo.com'}};

					
		StudentAssignment.find({
				studentId: req.user._id
			})
			.sort({
				_id: -1
			})
			.populate({
				path: 'assignmentId',
				populate: {
					path: 'comments.author'
				}
			})
			.populate('klassId')
			.exec(function(err, assignments) {

			if (err) {return res.send(err);}


				res.json(assignments);
			});
	});

	// TEACHER - get  all studentassignment records for a single assignment
	app.get('/api/studentassignments/assignment/:assignment_id', function(req, res) {
		StudentAssignment.find({
				assignmentId: req.params.assignment_id
		})
			.sort({
				_id: -1
			})
			.populate({
				path: 'assignmentId',
				populate: {
					path: 'comments.author'
				}
			})
			.populate('studentId')
			.exec(function(err, assignments) {

			if (err) {return res.send(err);}


				res.json(assignments);
			});
	});
	
	
	// get  studentassignment records for klassid and studentid
	app.get('/api/studentassignments/klass/:klass_id', function(req, res) {
		if (!req.user) 
			req.user = {id:'58fe458964b64e791bbecd90', _id:'58fe458964b64e791bbecd90', fname:'Welcome', email:'demo@demo.com', local: {email:'demo@demo.com'}};
		
		StudentAssignment.find({
				klassId: req.params.klass_id,
				studentId: req.user._id
			})
			.sort({
				_id: -1
			})
			.populate({
				path: 'assignmentId',
				populate: {
					path: 'comments.author'
				}
			})
			.populate('klassId')
			.exec(function(err, assignments) {

			if (err) {return res.send(err);}


				res.json(assignments);
			});
	});

	// submit student assignment
	app.put('/api/studentassignment/:_id', function(req, res) {
		var totalCount = 0;
		var completedCount = 0;

		var objForUpdate = {};

		if (req.body.isSubmitted) objForUpdate.isSubmitted = req.body.isSubmitted, objForUpdate.submittedDate = Date.now();
		if (req.body.work) objForUpdate.work = req.body.work;
		if (req.body.note) objForUpdate.note = req.body.note;
		if (req.body.draft) objForUpdate.draftSavedDate = Date.now();

		var setObj = { $set: objForUpdate }
		
		StudentAssignment.findOneAndUpdate({ _id: req.params._id}, setObj, function(err, doc) {
			if (err) {return res.send(err);}


			//update points
			if (req.body.pointsOn) {
				console.log('incrementing points by' + req.body.points);
				console.log('incrementing studentId, klassId' + req.body.studentId + ',' + req.body.klassId);

				StudentKlass.findOneAndUpdate({
					studentId: req.body.studentId,
					klassId: req.body.klassId
				}, {
					$inc: {
						points: req.body.points
					}
				}, function(err, sk) {

					if (err)
						res.send(err);
				});
			}
			//count of all studentassignments for one assignment
			StudentAssignment.find({
				assignmentId: doc.assignmentId
			}, function(err, sas) {
					if (err) {return res.send(err);}


				var totalCount = 0;
				var completedCount = 0;
				sas.forEach(function(sk) {
					if (sk.isSubmitted)
						completedCount++;

					totalCount++;
				});

				//update assignment record
				Assignment.findOneAndUpdate({
					_id: doc.assignmentId
				}, {
					$set: {
						numComplete: completedCount,
						numNotComplete: (totalCount - completedCount)
					}
				}, function(err, doc2) {
						if (err) {return res.send(err);}

				});
			});

			res.json({
				message: 'studentAssignment updated!',
				totalCount: totalCount,
				completedCount: completedCount
			});
		});
	});

	// ============================================================================
	// STUDENTKLASS MODEL
	// ============================================================================

	//get klasses for one student
	app.get('/api/studentklass/student/:student_id', function(req, res) {
		
		if (!req.user) 
			req.user = {id:'58fe458964b64e791bbecd90', _id:'58fe458964b64e791bbecd90', fname:'Welcome', email:'demo@demo.com', local: {email:'demo@demo.com'}};
		

		// StudentKlass.find({ studentId: req.params.student_id })
		StudentKlass.find({
				studentId: req.user._id
			})
			.sort({
				_id: -1
			})
			.populate('klassId')
			.exec(function(err, klasses) {

				if (err) {return res.send(err);}


				res.json(klasses);
			});
	});

	//get studentklass record for one class, one student
	app.get('/api/studentklass/klass/:klass_id', function(req, res) {

		if (!req.user) 
			req.user = {id:'58fe458964b64e791bbecd90', _id:'58fe458964b64e791bbecd90', fname:'Welcome', email:'demo@demo.com', local: {email:'demo@demo.com'}};
		
		StudentKlass.findOne({
				klassId: req.params.klass_id,
				studentId: req.user._id
			})
			.sort({
				_id: -1
			})
			.populate('studentId')
			.populate('klassId')
			.exec(function(err, sks) {

				if (err) {return res.send(err);}

				console.log('studentklass record************');
				console.log(sks);
				res.json(sks);
			});
	});

	//get students for one class
	app.get('/api/studentklass/klass/:klass_id/all', function(req, res) {

		if (!req.user) 
			req.user = {id:'58fe458964b64e791bbecd90', _id:'58fe458964b64e791bbecd90', fname:'Welcome', email:'demo@demo.com', local: {email:'demo@demo.com'}};
		
		StudentKlass.find({
				klassId: req.params.klass_id
			})
			.sort({
				_id: -1
			})
			.populate('studentId')  
			.exec(function(err, students) {

				if (err) {return res.send(err);}


				res.json(students);
			});
	});



	// create new studentklass -new enrollment =========================
	app.post('/api/studentklass', function(req, res) {

		//var joinCode = req.body.joinCode;

		// query klass table with join code
		// if found, return klassid and do enrollment
		// if not, return error?

		Klass.findOne({
				joinCode: req.body.joinCode
			})
			.exec(function(err, klass) {

					if (err) {return res.send(err);}

			
					if (!req.user) 
						req.user = {id:'58fe458964b64e791bbecd90', _id:'58fe458964b64e791bbecd90', fname:'Welcome', email:'demo@demo.com', local: {email:'demo@demo.com'}};


				var studentKlass = new StudentKlass();
				//studentKlass.studentId = req.body.studentId;
				studentKlass.studentId = req.user._id;
				studentKlass.joinDate = Date.now();
				studentKlass.klassId = klass._id;

				studentKlass.save(function(err, studentKlass) {

					if (err) {
						res.json({
							error: 'already joined'
						}); //res.send(err);
					} else {

						//need to update klass record with count of students enrolled
						//so first get count in studentklass where klassid 
						StudentKlass.find({
								klassId: klass._id
							})
							.count(function(err, count) {

								if (err) {return res.send(err);}


								Klass.findOneAndUpdate({
									_id: klass._id
								}, {
									$set: {
										numStudents: count
									}
								}, function(err, doc) {

									if (err) {return res.send(err);}


									//return klass so that view can immediately display new klass in array
									res.json(klass);
								});
							});
					} //end if else
				});
			});

	});

	// update the studentklass with enddate - student has left class
	app.put('/api/klass/:klass_id', function(req, res) {

		// use our klass model to find the bear we want
		Klass.findById(req.params.klass_id, function(err, klass) {

				if (err) {return res.send(err);}


			klass.name = req.body.name; // update the klass info
			klass.shortDesc = req.body.shortDesc; // update the klass info
			klass.longDesc = req.body.longDesc; // update the klass info
			klass.pointsOn = req.body.pointsOn; // update the klass info
			//klass.isPrivate = req.body.isPrivate; // update the klass info

			// save the bear
			klass.save(function(err) {
				if (err) {return res.send(err);}


				res.json({
					message: 'Klass updated!'
				});
			});

		});
	});

	// ===============================================================================
	// KLASS MODEL
	// ===============================================================================



	// get classes for userid
	app.get('/api/klasses', function(req, res) { 

		//Klass.find()function(err, klasses) {	
		//Klass.find().sort({_id: -1}).exec(function(err, klasses){
		//if (!req.user) 
		//	req.user = {id:'58fe458964b64e791bbecd90', _id:'58fe458964b64e791bbecd90', fname:'Welcome', email:'demo@demo.com', local: {email:'demo@demo.com'}};

	if (req.user){
	Klass.find({ teacherId: new ObjectId(req.user.id) }) 
			.sort({ klassNum: 1 })
			.populate('teacherId')
			.exec(function(err, klasses) {

				if (err) {return res.send(err);}


			console.log('hola'+JSON.stringify(klasses));
			res.json(klasses);
		});
	}
		
	});




	// get one klass record
	app.get('/api/klass/:klass_id', function(req, res) {

		Klass.findById(req.params.klass_id)
			.populate('teacherId')
			.exec(function(err, klass) {
				//Klass.findById(req.params.klass_id, function(err, klass) {
				if (err) {return res.send(err);}


				res.json(klass);
			});
	});

		// get one klass record
	app.get('/api/klass/username/:username/klassnum/:klassnum', function(req, res) {

		User.findOne({
			username: req.params.username
		})
		.exec(function(err, usr) {		
				if (err) {return res.send(err);}
		
		Klass.findOne({'klassNum':req.params.klassnum, 'teacherId': usr._id})
			.populate('teacherId')
			.exec(function(err, klass) {
				//Klass.findById(req.params.klass_id, function(err, klass) {
				if (err) {return res.send(err);}


				res.json(klass);
			}); 
			}); 
	});
	
	// delete one klass record
	app.delete('/api/klass/:klass_id', function(req, res) {

		Klass.remove({
			_id: req.params.klass_id
		}, function(err, klass) {
				if (err) {return res.send(err);}


			res.json({
				message: 'Successfully deleted'
			});
		});
	});

	// create new klass =========================
	app.post('/api/klass', function(req, res) {

		if (!req.user) 
			req.user = {id:'58fe458964b64e791bbecd90', _id:'58fe458964b64e791bbecd90', fname:'Welcome', email:'demo@demo.com', local: {email:'demo@demo.com'}};
		
		var klass = new Klass();
		klass.name = req.body.name;
		klass.shortDesc = req.body.shortDesc;
		klass.longDesc = req.body.longDesc;
		klass.username = req.body.username;
		klass.teacherId = req.user.id;
		klass.joinCode = shortid.generate();

		console.log('KLASS: ' + JSON.stringify(klass));


		//find max classNum
		Klass.find({'teacherId': klass.teacherId}).sort({'klassNum':-1}).limit(1)
			.exec(function(err, kls) {

				if (err) {return res.send(err);}
				
				if (kls[0])
					klass.klassNum = kls[0].klassNum + 1;
			  else
					klass.klassNum = 1; 
			
				klass.save(function(err, k) {

				if (err) {return res.send(err);}

		
					console.log('NEW KLASS: ' + JSON.stringify(k));

					res.json(k);

				});
		});
	});

	// update the klass with this id (not sure if I'm using this yet?)
	app.put('/api/klass/:klass_id', function(req, res) {

		// use our klass model to find the bear we want
		Klass.findById(req.params.klass_id, function(err, klass) {

				if (err) {return res.send(err);}


			klass.name = req.body.name; // update the klass info

			// save the bear
			klass.save(function(err) {
				if (err) {return res.send(err);}


				res.json({
					message: 'Klass updated!'
				});
			});

		});
	});

	// reset joincode
	app.put('/api/klass/:klass_id/newcode', function(req, res) {

		var joinCode = shortid.generate();

		// use our klass model to find the bear we want
		Klass.findById(req.params.klass_id, function(err, klass) {

				if (err) {return res.send(err);}


			klass.joinCode = joinCode; // update the klass info

			// save the bear
			klass.save(function(err) {
				if (err) {return res.send(err);}


				res.json({
					joinCode: joinCode
				});
			});

		});
	});

	// =============================================================================
	// ASSIGNMENT MODEL
	// =============================================================================

	// get All assignments for a student
	app.get('/api/assignments/all', function(req, res) {

		if (!req.user) 
			req.user = {id:'58fe458964b64e791bbecd90', _id:'58fe458964b64e791bbecd90', fname:'Welcome', email:'demo@demo.com', local: {email:'demo@demo.com'}};
		
		Assignment.find({
				teacherId: req.user._id
			})
			.sort({
				_id: -1,
				'comments._id': -1
			})
			.populate('comments.author')
			.populate('klassId')
			.exec(function(err, assignments) {

				if (err) {return res.send(err);}

				console.log('Assignments********************');
				console.log(JSON.stringify(assignments));
				res.json(assignments);
			});
	});

	// get assignments for a specified class
	app.get('/api/assignments/:klass_id', function(req, res) {
		Assignment.find({
				klassId: req.params.klass_id
			})
			.sort({
				_id: -1,
				'comments._id': -1
			})
			.populate('comments.author')
			.exec(function(err, assignments) {

				if (err) {return res.send(err);}


				console.log(JSON.stringify(assignments));
				res.json(assignments);
			});
	});


	// get one assignment record
	app.get('/api/assignment/:assignment_id', function(req, res) {
		Assignment.findById(req.params.assignment_id, function(err, assignment) {
				if (err) {return res.send(err);}


			res.json(assignment);
		});
	});

	// delete one assignment record
	app.delete('/api/assignment/:assignment_id', function(req, res) {

		Assignment.remove({
			_id: req.params.assignment_id
		}, function(err, assignment) {
			if (err)
				res.send(err);

			res.json({
				message: 'Successfully deleted'
			});
		});
	});

	// create new assignment =========================
	app.post('/api/assignment', function(req, res) {
	
	if (!req.user) 
			req.user = {id:'58fe458964b64e791bbecd90', _id:'58fe458964b64e791bbecd90', fname:'Welcome', email:'demo@demo.com', local: {email:'demo@demo.com'}};

		
		var assignment = new Assignment();
		assignment.name = req.body.name;
		assignment.description = req.body.description;
		assignment.due = req.body.due;
		assignment.teacherId = req.user.id;
		assignment.assignmentGroupId = req.body.assignmentGroupId;
		assignment.isAnnouncement = req.body.isAnnouncement;
		assignment.icon = req.body.icon;

		console.log(JSON.stringify(assignment));

		//find max classNum
		Assignment.find({'assignmentGroupId': assignment.assignmentGroupId}).sort({'assignmentNum':-1}).limit(1)
			.exec(function(err, asn) {

			  if (err) {res.send(err);}
				
				if (asn[0])
					assignment.assignmentNum = asn[0].assignmentNum + 1;
			  else
					assignment.assignmentNum = 1; 
			

		assignment.save(function(err, asgn) {

			if (err)
				res.send(err);

			res.json(asgn);
			
			/***
			//create studentassignments for every student enrolled
			var numNotComplete = 0;
			var promise = StudentKlass.find({
				klassId: req.body.klassId
			}).exec();
			promise.then(function(sks) {

				sks.forEach(function(sk) {
					var sa = new StudentAssignment();

					sa.assignmentId = assignment._id;
					sa.studentId = sk.studentId;
					sa.klassId = sk.klassId;

					console.log('assigning to studentid:' + sk.studentId);

					sa.save(function(err) {

						if (err)
							res.send(err);
					});
				});
				//update count back on assignment record
				numNotComplete = sks.length;

				Assignment.findOneAndUpdate({
					_id: assignment._id
				}, {
					$set: {
						numNotComplete: numNotComplete
					}
				}, {
					new: true
				}, function(err, doc) {
					if (err) {
						console.log("Something wrong when updating data!");
					}

					console.log(doc);
				});

				console.log('numNotComplete:' + numNotComplete);
				res.json({
					message: 'assignment created',
					_id: assignment._id,
					numNotComplete: numNotComplete
				});

			}); ***/
		});
		});
	});

	// update the assignment with this id 
	app.put('/api/assignment/:assignment_id', function(req, res) {

		
		
				var objForUpdate = {};

		if (req.body.name) objForUpdate.name = req.body.name;
		if (req.body.description) objForUpdate.description = req.body.description;
		if (req.body.points) objForUpdate.points = req.body.points;
		if (req.body.awardUponSubmit) objForUpdate.awardUponSubmit = req.body.awardUponSubmit;
		if (req.body.due) objForUpdate.due = req.body.due;


		var setObj = { $set: objForUpdate }
		
		console.log('setObj****************************');
		console.log(setObj);
		Assignment.findOneAndUpdate({ _id: req.params.assignment_id}, setObj, function(err, doc) {
			if (err)
				res.send(err);
			

				res.json({
					message: 'Assignment updated!'
				});
			});

	});

	// add a comment
	app.put('/api/assignment/:assignment_id/comment', function(req, res) {

		Assignment.findById(req.params.assignment_id, function(err, assignment) {

			if (err)
				res.send(err);

			assignment.comments.push({
				content: req.body.content,
				author: req.body.author
			});

			assignment.save(function(err) {
				if (err)
					res.send(err);

				res.json({
					message: 'Comment added!'
				});
			});

		});
	});

	// delete a comment
	app.delete('/api/assignment/:assignment_id/comment/:comment_index', function(req, res) {

		Assignment.findById(req.params.assignment_id, function(err, assignment) {

			if (err)
				res.send(err);

			assignment.comments[req.params.comment_index].remove();
			//could also use this line to specify _id of comment:
			//post.comments.id(my_id).remove();

			assignment.save(function(err) {
				if (err)
					res.send(err);

				res.json({
					message: 'Comment deleted!'
				});
			});

		});
	});

	// =====================================
	// ASSIGNMENT GROUP MODEL
	// =====================================
	
		// get assignments for a specified class
/**	app.get('/api/klass/:klass_id/assignmentgroup', function(req, res) {
		KlassAssignmentGroup.find({
				klassId: req.params.klass_id
			})
			.sort({
				_id: -1
			})
			.populate('assignmentGroupId')
			.exec(function(err, assignmentGroups) {

				if (err)
					res.send(err);

				console.log(JSON.stringify(assignmentGroups));
				res.json(assignmentGroups);
			});
	});
	**/
	// get assignments for a specified class
	app.get('/api/klass/:klass_id/assignmentgroup', function(req, res) {
		AssignmentGroup.find({
				klassId: req.params.klass_id
			})
			.sort({
				_id: -1
			})
			.exec(function(err, assignmentGroups) {

				if (err)
					res.send(err);

				console.log(JSON.stringify(assignmentGroups));
				res.json(assignmentGroups);
			});
	});
	
	// NEW: get assignment groups for a user+class
	app.get('/api/username/:username/klassnum/:klassnum/assignmentgroups', function(req, res) {
		//look up klassId w username+klassnum
		
		Klass.findOne({
			klassNum: req.params.klassnum,
			username: req.params.username
		})
		.exec(function(err, kls) {		
			 if (err) {res.send(err);}

			console.log('called: '+req.params.username + req.params.klassnum + JSON.stringify(kls));

			var klsid = '';
			if (kls)
				klsid = kls._id;
			
				AssignmentGroup.find({
				klassId: klsid
			})
			.sort({
				_id: -1
			})
			.exec(function(err, assignmentGroups) {

				if (err) {res.send(err); return;}

				//console.log(JSON.stringify(assignmentGroups));
				res.json(assignmentGroups);
		});
		});
	});
	
	// delete one klass assignment group association
	/**app.delete('/api/klass/:klass_id/assignmentgroup/:as_id', function(req, res) {

		KlassAssignmentGroup.remove({
			klassId: req.params.klass_id, assignmentGroupId: req.params.as_id
		}, function(err, klass) {
			if (err)
				res.send(err);

			res.json({
				message: 'Successfully deleted'
			});
		});
	});**/
	
	app.delete('/api/klass/:klass_id/assignmentgroup/:as_id', function(req, res) {

		AssignmentGroup.remove({
			//klassId: req.params.klass_id, assignmentGroupId: req.params.as_id
			_id: req.params.as_id
		}, function(err, klass) {
			if (err)
				res.send(err);

			res.json({
				message: 'Successfully deleted'
			});
		});
	});
	
  // get assignmentgroup
	app.get('/api/assignmentgroup/:ag_id', function(req, res) {
		AssignmentGroup.findById(req.params.ag_id, function(err, assignment) {
			if (err) {res.send(err); return;}

			res.json(assignment);
		});
	});
	
  // NEW get assignment
	app.get('/api/assignment/assignmentgroup/:agid/assignmentnum/:asnum', function(req, res) {
		Assignment.findOne({'assignmentGroupId': req.params.agid, 'assignmentNum':req.params.asnum}, function(err, assignment) {
			if (err) {res.send(err); return;}

			res.json(assignment);
		});
	});
	
	// NEW: get One assignment group for a user+class + agnum
	app.get('/api/username/:username/klassnum/:klassnum/agnum/:agnum', function(req, res) {
		//look up klassId w username+klassnum
		
		Klass.findOne({
			klassNum: req.params.klassnum,
			username: req.params.username
		})
		.exec(function(err, kls) {		
			 if (err) {res.send(err);}

			console.log('called: '+req.params.username + req.params.klassnum + JSON.stringify(kls));

			var klsid = '';
			if (kls)
				klsid = kls._id;
			
			console.log('***KLSID:'+klsid)
			
				AssignmentGroup.findOne({
				klassId: klsid,
				assignmentGroupNum: req.params.agnum
			})
			.sort({
				_id: -1
			})
			.exec(function(err, assignmentGroup) {

				if (err) {res.send(err); return;}

				//console.log(JSON.stringify(assignmentGroups));
				res.json(assignmentGroup);
		});
		});
	});	
	
	// create new assignmentgroup =========================
	app.post('/api/assignmentgroup', function(req, res) {
	
	if (!req.user) 
			req.user = {id:'58fe458964b64e791bbecd90', _id:'58fe458964b64e791bbecd90', fname:'Welcome', email:'demo@demo.com', local: {email:'demo@demo.com'}};

		
		var assignmentGroup = new AssignmentGroup();
		assignmentGroup.name = req.body.name;
		assignmentGroup.description = req.body.description;
		assignmentGroup.lesson = req.user.lesson;
		assignmentGroup.icon = req.body.icon;
		assignmentGroup.isCustom = req.body.isCustom;
		assignmentGroup.isPublic = req.body.isPublic;
		assignmentGroup.createdById = req.user._id;
		assignmentGroup.klassId = req.body.klassId;

		console.log('new AG: '+ JSON.stringify(assignmentGroup));

		//find max classNum
		AssignmentGroup.find({'klassId': assignmentGroup.klassId}).sort({'assignmentGroupNum':-1}).limit(1)
			.exec(function(err, ag) {

			  if (err) {res.send(err);}
				 
				console.log('found AG: '+ JSON.stringify(ag));

				if (ag[0]) {
					assignmentGroup.assignmentGroupNum = ag[0].assignmentGroupNum + 1;
console.log('in if: '+ assignmentGroup.assignmentGroupNum);
				} else {
					assignmentGroup.assignmentGroupNum = 1; 
console.log('in else: '+ assignmentGroup.assignmentGroupNum);
				}
			
console.log('new ag num: '+ assignmentGroup.assignmentGroupNum);

		assignmentGroup.save(function(err, ag1) {

			if (err)
				res.send(err);

			res.json(ag1);

			//add klassAssignmentGroup record
	  //	var klassAssignmentGroup = new KlassAssignmentGroup();
		//	klassAssignmentGroup.klassId = req.body.klassId;
		//	klassAssignmentGroup.assignmentGroupId = assignmentGroup._id;

		//	klassAssignmentGroup.save(function(err, kag) {
    //
		//		if (err)
		//			res.send(err);
		//		
		//		res.json(kag);
    //
		//	});
			});
		});
	});
	
	// get assignments for an assignment Group
	app.get('/api/assignmentgroup/:ag_id/assignments', function(req, res) {
		Assignment.find({
				assignmentGroupId: req.params.ag_id
			})
			.sort({
				_id: -1
			})
			//.populate('assignmentGroupId')
			.exec(function(err, assignments) {

				if (err) {res.send(err); return;}

				console.log(JSON.stringify(assignments));
				res.json(assignments);
			});
	});
	
	
	
	
	
	// =============================================================================
	// AUTHENTICATE (FIRST LOGIN) ==================================================
	// =============================================================================

	// locally --------------------------------
	// LOGIN ===============================
	// show the login form
	app.get('/login', function(req, res) {
		res.render('login.ejs', {
			message: req.flash('loginMessage')
		});
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile-signup', // redirect to the secure profile section
		failureRedirect: '/login', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));
	
		// process the login form
	app.get('/demo', passport.authenticate('demo-login', {
		successRedirect: '/demohome', // redirect to the secure profile section
		failureRedirect: '/', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	// SIGNUP =================================
	// show the signup form
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', {
			message: req.flash('signupMessage')
		});
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile-signup', // redirect to the secure profile section
		failureRedirect: '/signup', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	// facebook -------------------------------

	// send to facebook to do the authentication
	app.get('/auth/facebook', passport.authenticate('facebook', {
		scope: 'email'
	}));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect: '/dashboard',
			failureRedirect: '/'
		}));

	// twitter --------------------------------

	// send to twitter to do the authentication
	app.get('/auth/twitter', passport.authenticate('twitter', {
		scope: 'email'
	}));

	// handle the callback after twitter has authenticated the user
	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect: '/dashboard',
			failureRedirect: '/'
		}));


	// google ---------------------------------

	// send to google to do the authentication
	app.get('/auth/google', passport.authenticate('google', {
		scope: ['profile', 'email']
	}));

	// the callback after google has authenticated the user
	app.get('/auth/google/callback',
		passport.authenticate('google', {
			successRedirect: '/profile-signup',
			failureRedirect: '/'
		}));

	// =============================================================================
	// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
	// =============================================================================

	// locally --------------------------------
	app.get('/connect/local', function(req, res) {
		res.render('connect-local.ejs', {
			message: req.flash('loginMessage')
		});
	});
	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect: '/dashboard', // redirect to the secure profile section
		failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	// facebook -------------------------------

	// send to facebook to do the authentication
	app.get('/connect/facebook', passport.authorize('facebook', {
		scope: 'email'
	}));

	// handle the callback after facebook has authorized the user
	app.get('/connect/facebook/callback',
		passport.authorize('facebook', {
			successRedirect: '/dashboard',
			failureRedirect: '/'
		}));

	// twitter --------------------------------

	// send to twitter to do the authentication
	app.get('/connect/twitter', passport.authorize('twitter', {
		scope: 'email'
	}));

	// handle the callback after twitter has authorized the user
	app.get('/connect/twitter/callback',
		passport.authorize('twitter', {
			successRedirect: '/dashboard',
			failureRedirect: '/'
		}));


	// google ---------------------------------

	// send to google to do the authentication
	app.get('/connect/google', passport.authorize('google', {
		scope: ['profile', 'email']
	}));

	// the callback after google has authorized the user
	app.get('/connect/google/callback',
		passport.authorize('google', {
			successRedirect: '/profile-signup',
			failureRedirect: '/'
		}));

	// =============================================================================
	// UNLINK ACCOUNTS =============================================================
	// =============================================================================
	// used to unlink accounts. for social accounts, just remove the token
	// for local account, remove email and password
	// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', isLoggedIn, function(req, res) {		
		var user = req.user;
		user.local.email = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/dashboard');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', isLoggedIn, function(req, res) {
		var user = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/dashboard');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', isLoggedIn, function(req, res) {
		var user = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/dashboard');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', isLoggedIn, function(req, res) {
		var user = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/dashboard');
		});
	});
	
	
	// NEWSLETTER SIGNUP ==============================
	app.post('/newsletter', function (req, res) {
		
		
		
		// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://paul.millar%40gmail.com:ventura123@smtp.gmail.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'newsletter@star.school', // sender address
    to: 'paul.millar@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: '<b>Hello world 🐴</b>\n\n' + req.body.email // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
   console.log(error);
  res.send({message:'Sorry, we are having trouble processing your request.'+ error});

    }
    console.log('Message sent: ' + info.response);
    res.send({message: 'Thanks!  You will receive our next newsletter.'});

});
		
/***		
          var mailOpts, smtpTrans;
          smtpTrans = nodemailer.createTransport('SMTP', {
          service: 'Gmail',
            auth: {
              user: "paul.millar@gmail.com",
              pass: "XXXX"
            }
          });

              var subj = 'Star School Newsletter Signup';

          mailOpts = {
            from: 'signup@star.school', //grab form data from equest body object
            to: 'paul.millar@gmail.com',
            subject: subj,
            text: 'Someone wants to receive the newsletter: \n\n' + req.body.email
          };
         smtpTrans.sendMail(mailOpts, function (error, response) {
           if (error) {
               //     res.render('contact', { title: 'Raging Flame Laboratory - Contact', msg: 'Error occured, message not sent.', err: true, page: 'contact' })
               //res.sendFile(express.static(__dirname+"/public/contact.html"));
               console.log("error"+error);
	       //res.sendfile('./public/contact.html'); // nd)
	      res.send('Sorry, we are having trouble processing your request.');

           } else {
              //res.render('contact', { title: 'Raging Flame Laboratory - Contact', msg: 'Message sent! Thank you.', err: false, page: 'contact' })
              console.log("success");
	      //res.sendfile('./public/contact.html'); // nd)

                res.send('Thanks for contacting us.  You will receive our next newsletter.');
           }
        });
		*******/
      });

	
	app.get('/educate/:username/:class/:ag/:lesson/detail', hasAccessToClass, function(req, res) {
	   res.sendfile('./public/views/shell.html'); //
		//res.json({ msg: 'YES! /educate/'+req.params.username+'/'+req.params.class+'/'+req.params.ag+'/'+req.params.lesson+'/detail'});
	});
	
	app.get('/educate/:username/:class/:ag/:lesson', hasAccessToClass, function(req, res) {
	   res.sendfile('./public/views/shell.html'); //
		//res.json({ msg: 'YES! /educate/'+req.params.username+'/'+req.params.class+'/'+req.params.ag+'/'+req.params.lesson});
	});
	
	app.get('/educate/:username/:class/:ag', hasAccessToClass, function(req, res) {
	   res.sendfile('./public/views/shell.html'); //
		//res.json({ msg: 'YES! /educate/'+req.params.username+'/'+req.params.class+'/'+req.params.ag});
	});
	
	app.get('/educate/:username/:class', hasAccessToClass, function(req, res) {
	   res.sendfile('./public/views/shell.html'); //
		//res.json({ msg: 'YES! /educate/'+req.params.username+'/'+req.params.class});
	});
	
	app.get('/educate/:username/:class/about', hasAccessToClass, function(req, res) {
	   res.sendfile('./public/views/shell.html'); //
		//res.json({ msg: 'YES! /educate/'+req.params.username+'/'+req.params.class});
	});
	
	app.get('/educate/:username/:class/students', hasAccessToClass, function(req, res) {
	   res.sendfile('./public/views/shell.html'); //
		//res.json({ msg: 'YES! /educate/'+req.params.username+'/'+req.params.class});
	});
	
	app.get('/educate/:username', hasAccessToTeacherHome, function(req, res) {
	   res.sendfile('./public/views/shell.html'); //
  	//res.status(200).send("Sucess: /educate/"+req.params.username);
	});
	
	app.get('/educate', function(req, res) {
	   res.sendfile('./public/views/shell.html'); //
		//res.json({ msg: 'YES! Educate'});
	});
	

	// GO TO ANGULAR ROUTE =========================
	//app.get('*', isLoggedIn, function(req, res) {
	app.get('*', function(req, res) {
		//res.sendFile('shell.html', {'root': './public/views/'});

		res.render('shell.html', {
			user: req.user
		});
	});


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}

function hasAccessToClass(req, res, next) {
	//(!isTeacherHomePagePrivate || isOwner || isStudentInClass)...user.homepageprivate Y/N...if usertype=student, query studentclass

// isTeacherHomePagePrivate?
		User.findOne({'username': req.params.username})
			.exec(function(err, usr) {

			  if (err) {res.send(err);}

				//page doesn't exist
				if (!usr) {
  				res.status(404).send("Sorry, can't find that teacher!");
					return;
					}
			
				//not private, so display page
				if (!usr.isPrivate) {
					 return next();		
				} else {
					
					// isOwner?
   				if (req.isAuthenticated()) {
      			
      			//YES! user=owner
						if (req.user.username == req.params.username){
							return next();				
						} else {
							
							//not owner, but logged in; is student in class?
							StudentKlass.findOne({'klassId': req.params.class, 'studentId': req.user._id})
								.exec(function(err, sk) {

			  					if (err) {res.send(err);}

									//YES, student in class
									if (sk)
  									return next();
								
									res.status(404).send("Sorry, you're not enrolled in this class!");
									return;


							});
													
						}
						
	 				} else {
							res.status(404).send("Sorry, not allowed");
							return;
					}
					
				} //end else is private
				
			});
	
	//if none of the conditions above returned next(), then 404
	//res.status(404).send("Sorry can't find that!");

}


function hasAccessToTeacherHome(req, res, next) {
	//(!isTeacherHomePagePrivate || isOwner || isStudentInAnyClassOfThatTeacher)

// isTeacherHomePagePrivate?
		User.findOne({'username': req.params.username})
			.exec(function(err, usr) {

			  if (err) {res.send(err);}

				//page doesn't exist
				if (!usr) {
  				res.status(404).send("Sorry, can't find that teacher!");
					return;
				}				

				//not private, so display page
				if (!usr.isPrivate) { 
					 return next();		
				} else {
					
					// isOwner?
   				if (req.isAuthenticated()) {
      			
      			//YES! user=owner
						if (req.user.username == req.params.username){
							return next();				
						} else {
							
						
							//get all classids for that teacherid
							Klass.find({teacherId: usr._id}, {_id: 1})
								.exec(function(err, docs) {

    						// Map the docs into an array of just the _ids
    						var classIds = docs.map(function(doc) { return doc._id; });

    						// Get the studentKlass records for that set of klasses and that student.
    						StudentKlass.findOne({'klassId': {$in: classIds}, 'studentId': req.user._id})
									.exec(function(err, sk) {

			  						if (err) {res.send(err);}

										//YES, student in A class of this teacher
										if (sk)
  										return next();  
									
										res.status(404).send("Sorry, it doesn't look like you have a class with this teacher.");
										return;
								
								});
							});							
													
						} //end else is not owner
						
	 				} else {
							res.status(404).send("Sorry, not allowed");
							return;
					}
					
				} //end else is private
				
			});
	
	//if none of the conditions above returned next(), then 404
	//res.status(405).send("Sorry can't find that!");

}
