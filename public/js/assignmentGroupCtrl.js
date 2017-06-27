//var Klass = require('../../app/models/klass');

//angular.module('klassCtrl', ['ui.bootstrap'])
angular.module('assignmentGroupCtrl', ['ui.bootstrap', 'ngMaterial', 'youtube-embed'])

.controller('assignmentGroupCtrl',  function($scope, $http, services, $modal, $log, $routeParams, agRecord, assignmentList, user, $mdDialog, $mdSidenav, $location) {
  
	$scope.anotherGoodOne = 'https://www.youtube.com/watch?v=KsUX7Piez-0';

	//$scope.klassName = klassRecord.name;
	$scope.thisUsername = $routeParams.username;	 
	$scope.thisKlassNum = $routeParams.klassnum;	 

	$scope.thisAG = agRecord.data;
	//alert(JSON.stringify($scope.thisAG));
	//$scope.thisAG._id = agRecord.data._id;
	//$scope.thisKlassId = $routeParams.classId;
			$scope.user = user.data;
			//$scope.userId = user.data._id;
	
if (assignmentList){
		$scope.assignmentList = assignmentList.data;
} else {
		services.getAssignmentsForGroup($scope.thisAG._id)
		.success(function(data) {
			$scope.assignmentList = data;
		});
}
	

	
	//populate leaderboard
//	services.getStudentsInKlass($scope.thisKlassId)
//		.success(function(data) {
//			$scope.leaderboard = data;
//		});
	
			services.getKlasses()
				.success(function(data2) {
					$scope.klassList = data2;
				});
	
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
		//if ($scope.user.userType == "student")
    //	$location.path('/studentassignments');
		//else 
    	$location.path('/assignments'); 
	};

	$scope.goProfile = function(){
    $location.path('/profile'); // path not hash
  };
	
	$scope.goHome = function(){
	//	if ($scope.user.userType == "student")
  //  	$location.path('/studentdashboard');
	//	else 
    	$location.path('/dashboard');  
	};

	
	$scope.masterAssignment = {
		name: null,
		description: null,
		assignmentGroupId: $scope.thisAG._id,
		due: null,
		icon: '',
		numComplete: 0,
		numNotComplete: 0,
		assignmentNum: 0
	};
	
	$scope.newAssignment = angular.copy($scope.masterAssignment);


	
	//for left side nav
	$scope.openLeftMenu = function() {
				$mdSidenav('left').toggle();
			};	
	
//for logout menu
	var originatorEv;
		$scope.openMenu = function($mdOpenMenu, ev) {
			originatorEv = ev;
			$mdOpenMenu(ev);
		};
	
	$scope.commentData = {
		author: null,
		content: null
	};












	//ASSIGNMENT ########################		
	$scope.showAssignment = function(ev) {
		$mdDialog.show({
				controller: DialogAssignmentController,
				templateUrl: 'dialog.assignment.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
				locals: {
					nas: $scope.newAssignment,
					alist: $scope.assignmentList,
					master: $scope.masterAssignment,
					agid: $scope.thisAG._id
				}
			})
			.then(function(answer) {
				//$scope.status = 'You said the information was "' + answer + '".';
			$scope.newAssignment = angular.copy($scope.masterAssignment);
			}, function() {
			$scope.newAssignment = angular.copy($scope.masterAssignment);
				$scope.status = 'You cancelled the dialog.';
			});
	};



	function DialogAssignmentController($scope, $mdDialog, $log, nas, alist, master, agid) {

		//$scope.newAssignment = angular.copy(nas);
		$scope.newAssignment = nas;
		$scope.newAssignment.assignmentGroupId = agid;
		$scope.assignmentList = alist;
		
		//$scope.masterAssignment = master;

		//$scope.newAssignment.isAnnouncement = isAnn;
		//$scope.newAssignment.name = nas.name;
		//$scope.newAssignment.description = nas.description;
		//$scope.newAssignment.due = nas.due;
		//$scope.newAssignment.klassId = nas.klassId;

		$scope.hide = function() {
			$mdDialog.hide();
		}; 

		$scope.cancel = function() {
			$mdDialog.cancel();
		}; 

		$scope.goAssignment = function() {

			if ($scope.newAssignment.name.length === 0) {
				//do nothing
			} else {
			  services.createAssignment($scope.newAssignment)
				.then(function(data) {
					console.log('createAssignment data:' + JSON.stringify(data) + ' id:' + data.data._id);
					//$log.log('createAssignment data:' + JSON.stringify(data) + ' id:' + data.data._id)
						//set id of klass just created
					$scope.newAssignment._id = data.data._id;
					$scope.newAssignment.assignmentNum = data.data.assignmentNum;
				  $scope.newAssignment.numNotComplete = data.data.numNotComplete;
				  $scope.newAssignment.numComplete = 0;
				  $scope.newAssignment.due = $scope.newAssignment.due.toISOString();
					//alert(JSON.stringify(data));
					$scope.assignmentList.unshift($scope.newAssignment);

				});
			$mdDialog.hide();
			}
		};
			
	}



});