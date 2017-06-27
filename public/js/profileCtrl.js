
angular.module('profileCtrl', ['ui.bootstrap', 'ngMessages'])

.controller('profileCtrl', function($routeParams, $scope, $http, services, $modal, $log, $timeout, $mdSidenav, $mdDialog, user, $location) {

	    $scope.user = {};
			$scope.user = user.data;
			
			//if google sign-in (rather than signup) send directly to dashboard
	   // if (user.data.firstName) {
		//	if ($scope.user.userType == "student")
    //			$location.path('/studentdashboard');
		//		else 
    //			$location.path('/dashboard');
		//	}
	
			$scope.user = user.data;
			$scope.userId = user.data._id;
			$scope.email = user.data.local.email ? user.data.local.email : user.data.google.email;
			$scope.user.username = user.data.username;
			$scope.fname = user.data.firstName;
	
			if (!$scope.user.username ){
				//alert('no username');
				var tempusername;

				if (user.data.google) {
					tempusername = user.data.google.name.split(' ')[0].toLowerCase()
				} else {
					//create temp username from email
				 	tempusername = $scope.email.split('@')[0];
					tempusername = tempusername.replace(/[\W]+/g,"_");
					tempusername = tempusername.substring(0,15).toLowerCase();
				//services.createAsset({userid: $scope.userId, username: tempusername})
				//		.then(function(data2) {
				//					//alert('in then');
				//					//alert('username'+data2.username);
		    //					$scope.userName = data2.username;
    			$scope.user.username = tempusername;
				}
				//	});
			}	
	
	//capture first username so validation will not fail if user keeps that value
	$scope.originalUsername = angular.copy($scope.user.username);
	//IF first name is null
	//BUT google.name is not null
	//THEN take first part of google name as first name
	
	//IF username is null
	//and google.name is not null
	//THEN take first part of googlename as username
	//OR
	//USE first part of email as username

	$scope.isReadOnly = true;

	$scope.setEditMode = function() {
			$scope.isReadOnly = false;
	};

	$scope.togglePremium = function(newval) {
			$scope.user.isPremium = newval;
	};
	
	$scope.togglePrivate = function(newval) {
			$scope.user.isPrivate = newval;
	};

		$scope.toggleUserType = function(newval) {
			$scope.user.userType = newval;
	};
	
		$scope.cancelEditMode = function() {
			$scope.isReadOnly = true;
				//if ($scope.user.userType == "student")
    		//	$location.path('/studentdashboard');
				//else 
    		//	$location.path('/dashboard');
	};
	services.getKlasses()
		.success(function(data2) {
			$scope.klassList = data2;
	});
	//services.getKlassesForStudent()
	//	.success(function(data2) {
	//		$scope.klassList = data2;
	//});
	

	
	$scope.changeView = function(view){
    $location.path('/'+view); // path not hash
  };

	$scope.classView = function(username, klassNum){
		//if ($scope.user.userType == "student")
    //	$location.path('/studentclass/' + id);
		//else 
    	$location.path('/educate/' + username + '/' + klassNum);
  };
	
	$scope.goAssignments = function() {
		if ($scope.user.userType == "student")
    	$location.path('/studentassignments');
		else 
    	$location.path('/assignments'); 	};

	$scope.goProfile = function(){
    $location.path('/profile'); // path not hash
  };
	
	$scope.goHome = function(){
		if ($scope.user.userType == "student")
    	$location.path('/studentdashboard');
		else 
    	$location.path('/dashboard');  
	};

	
	$scope.updateProfile = function(){ 
		if ($scope.user._id == '58cab7d8796c46353244cf54')
			$scope.user.local.email = 'demo2@demo.com';
				
		$scope.user.email = $scope.user.local.email;
		services.updateProfile($scope.user)
			.success(function(data2) {
				$scope.isReadOnly = true;
//update origusername once saved successfully
$scope.originalUsername = angular.copy($scope.user.username);
			
			if ($scope.user.userType == "student")
    			$location.path('/studentdashboard');
				else 
    			$location.path('/dashboard');
			});
	};
	
	$scope.openLeftMenu = function() {
		$mdSidenav('left').toggle();
	};

	var originatorEv;
	$scope.openMenu = function($mdOpenMenu, ev) {
		originatorEv = ev;
		$mdOpenMenu(ev);
	};
	

	
	//for modal =========================================
	$scope.masterStudentKlass = {
		klassId: {
			name: null,
			shortDesc: null,
			longDesc: null,
			teacherId: null,
			numStudents: 0
		}
	};

	$scope.klass = angular.copy($scope.masterStudentKlass);





});