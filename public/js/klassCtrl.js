//var Klass = require('../../app/models/klass');

//angular.module('klassCtrl', ['ui.bootstrap'])
angular.module('klassCtrl', ['ui.bootstrap', 'ngMaterial'])

.controller('klassCtrl',  function($scope, $http, services, $modal, $log, $routeParams, klassRecord, assignmentGroupList, user, $mdDialog, $mdSidenav, $location) {

	//$scope.klassName = klassRecord.name;
	var original = klassRecord.data;
	$scope.thisKlass = klassRecord.data;
	$scope.thisUsername = $routeParams.username;	 

	$scope.assignmentGroupList = {};
	$scope.assignmentGroupList = assignmentGroupList.data;
	
			$scope.user = user.data;
			//$scope.userId = user.data._id;
			//$scope.email = user.data.local.email;
			//$scope.fname = user.data.firstName;
	

	
	//populate leaderboard
	services.getStudentsInKlass($scope.thisKlass._id)
		.success(function(data) {
			$scope.leaderboard = data;
		});
	
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

	$scope.goHomePage = function(){
		window.location = "/"
  };
	
  $scope.showDeleteConfirm = function(ev, ind, agid) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Remove this set of assignments from your class?')
          .textContent('Any work submitted by students will be deleted.' + agid)
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Yes, remove')
          .cancel('Keep it');

    $mdDialog.show(confirm).then(function() {
				services.deleteKlassAssignmentGroup($scope.thisKlass._id,agid);
				$scope.assignmentGroupList.splice(ind,1);
    }, function() {
      //$scope.status = 'You decided to keep your debt.';
    });
  };	
	
	$scope.masterAssignmentGroup = {
		name: null,
		description: null,
		lesson: null,
		icon: null,
		isCustom: null,
		isPublic: 0
	};
	
	$scope.newAssignmentGroup = angular.copy($scope.masterAssignmentGroup);

	
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


	//Angular Material Modal

	//ASSIGNMENT ########################		
	$scope.showAssignmentGroup = function(ev) {
		$mdDialog.show({
				controller: DialogAssignmentGroupController,
				templateUrl: 'dialog.assignmentgroup.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
				locals: {
					nas: $scope.newAssignmentGroup,
					alist: $scope.assignmentGroupList,
					master: $scope.masterAssignmentGroup,
					klassId: 	$scope.thisKlass._id
				}
			})
			.then(function(answer) {
				//$scope.status = 'You said the information was "' + answer + '".';
			$scope.newAssignmentGroup = angular.copy($scope.masterAssignmentGroup);
			}, function() {
			$scope.newAssignmentGroup = angular.copy($scope.masterAssignmentGroup);
				$scope.status = 'You cancelled the dialog.';
			});
	};

 

	function DialogAssignmentGroupController($scope, $mdDialog, $log, nas, alist, master, klassId) {

		//$scope.newAssignment = angular.copy(nas);
		$scope.newAssignmentGroup = nas;
		$scope.assignmentGroupList = alist;
		
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

		$scope.goAssignmentGroup = function() {
			
			//first create assignmentGroup record
			
			//then create classAssignmentGroup record
			
			//then unshift classAssignmentGroup record

			if ($scope.newAssignmentGroup.name.length === 0) {
				//do nothing
			} else {
				$scope.newAssignmentGroup.klassId = klassId;
				//alert('about to call');
			  services.createAssignmentGroup($scope.newAssignmentGroup)
				.then(function(data) {
					//alert('in then');
					console.log('createAssignmentGroup data:' + JSON.stringify(data) + ' id:' + data.data._id);
					$log.log('createAssignmentGroup data:' + JSON.stringify(data) + ' id:' + data.data._id)
						//set id of klass just created
					$scope.newAssignmentGroup._id = data.data._id;
					$scope.newAssignmentGroup.assignmentGroupNum = data.data.assignmentGroupNum;
					alert('done'+data.data._id);
					alert('length:'+$scope.assignmentGroupList.length);
					//var klassAssignmentGroup = {'_id': data.data._id, 'klassId': $scope.newAssignmentGroup.klassId, 'assignmentGroupId': {'icon': $scope.newAssignmentGroup.icon, 'name': $scope.newAssignmentGroup.name } };
					//alert('new:'+JSON.stringify($scope.newAssignmentGroup));
					//alert('list:'+JSON.stringify($scope.assignmentGroupList));
					//	$scope.assignmentGroupList.unshift(klassAssignmentGroup);
					$scope.assignmentGroupList.unshift($scope.newAssignmentGroup);

				});
			$mdDialog.hide();
			}
		};
			
	}



});