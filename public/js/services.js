angular.module('services', [])

	// super simple service
	// each function returns a promise object
	.factory('services', ['$http',function($http) {
		return {
			
      getUserId : function() {
			  return $http.get('/api/userid');
			},
			updateProfile : function(userData) {
				return $http.put('/api/user/' + userData._id, userData ).success(function (status){
	        return status.data;  });
			},
			getKlasses : function() {
			  return $http.get('/api/klasses'); ///' + teacher_id);
			},
			getKlass : function(id) {
			  return $http.get('/api/klass/' + id); ///' + teacher_id);
			},
			getKlass2 : function(username, klassnum) {
			  return $http.get('/api/klass/username/' + username + '/klassnum/' + klassnum); ///' + teacher_id);
			},
			createKlass : function(klassData) {
				return $http.post('/api/klass', klassData).success(function (results){
					return results;
        });
			},
			updateKlass : function(klassData) {
				return $http.put('/api/klass/' + klassData._id, klassData ).success(function (status){
	        return status.data;  });
			},
			//	createKlass : function(klassData) {
		//		return $http.post('/api/klass', klassData);
		//	},
			deleteKlass : function(id) {
				return $http.delete('/api/klass/' + id);
			},
			resetKlassCode : function(id) {
				return $http.put('/api/klass/' + id + '/newcode').success(function (status){
	        return status.data;  });
			},		
			getAssignments : function(id) {
			  return $http.get('/api/assignments/' + id); //klass_id
			},
			getAssignmentsForGroup : function(id) {
			  return $http.get('/api/assignmentgroup/' + id + '/assignments'); //agid
			},
			getAssignmentGroups : function(id) {
			  return $http.get('/api/klass/' + id + '/assignmentgroup'); //klass_id
			},
			getAssignmentGroups2 : function(username, klassnum) {
			  return $http.get('/api/username/' + username + '/klassnum/' + klassnum + '/assignmentgroups'); //klass_id
			},
			deleteKlassAssignmentGroup : function(kid, agid) {
			  return $http.delete('/api/klass/' + kid + '/assignmentgroup/' + agid); //klass_id
			},
			getAssignmentGroup : function(id) {
			  return $http.get('/api/assignmentgroup/' + id); //ag_id
			},
			getAssignmentGroup2 : function(username, klassnum, agnum) {
			  return $http.get('/api/username/' + username + '/klassnum/' + klassnum + '/agnum/' + agnum); //klass_id
			},
			createAssignmentGroup : function(assignmentGroupData) {
				return $http.post('/api/assignmentgroup', assignmentGroupData).then(function (results){
					return results;
        });
			},
			getAllAssignments : function() {
			  return $http.get('/api/assignments/all'); //all for a student
			},
			getAssignment : function(id) {
			  return $http.get('/api/assignment/' + id); //assignment_id
			},
			getAssignment2 : function(agid, asnum) {
			  return $http.get('/api/assignment/assignmentgroup/' + agid + '/assignmentnum/' + asnum); //assignment_id
			},
			getAllStudentAssignments : function() {
			  return $http.get('/api/studentassignments/all'); //all for a student
			},
			getStudentAssignments : function(id) {
			  return $http.get('/api/studentassignments/klass/' + id); //klass_id
			},
			getStudentAssignmentsToReview : function(id) {
			  return $http.get('/api/studentassignments/assignment/' + id); //assignment_id
			},
			getStudentAssignmentDetails : function(id) {
			  return $http.get('/api/studentassignment/' + id); //assignment_id
			},
			getAssignmentDetails : function(id) {
			  return $http.get('/api/assignment/' + id); //assignment_id
			},
			submitStudentAssignment : function(id, saData) {
				return $http.put('/api/studentassignment/' + id, saData ).success(function (status){
	        return status.data;  });
			},
			createAssignment : function(assignmentData) {
				return $http.post('/api/assignment', assignmentData).then(function (results){
					return results;
        });
			},
			deleteAssignment : function(id) {
				return $http.delete('/api/assignment/' + id);
			},
			updateAssignment : function(assignmentData) {
				return $http.put('/api/assignment/' + assignmentData._id, assignmentData ).success(function (status){
	        return status.data;  });
			},
			addComment : function(id, commentData) { //id is assignmentId
				return $http.put('/api/assignment/' + id + '/comment', commentData).then(function (status){
	                                return status.data;
                              });
			},
			deleteComment : function(id, commentIndex) {
				return $http.put('/api/assignment/' + id + '/comment/' + commentIndex).then(function (status){
	                                return status.data;
                              });
			},
			getStudentsInKlass : function(id) {
			  return $http.get('/api/studentklass/klass/' + id + '/all'); //klass_id
			},		
			getStudentKlass : function(id) {
			  return $http.get('/api/studentklass/klass/' + id); //klass_id
			},
			getKlassesForStudent : function(id) {
			  return $http.get('/api/studentklass/student/' + id); //student_id
			},
			addStudentToClass : function(data) {
				return $http.post('/api/studentklass', data).then(function (results){
					return results;
        });
			}
		}
	}])
//	    .service('imageService',['$q','$http',function($q,$http){
//        this.loadImages = function(){
//            return $http.jsonp("https://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=JSON_CALLBACK");
//        };
//    }])
;
