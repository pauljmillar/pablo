var klassApp = angular.module('klassApp', ['ngMaterial', 'ngRoute', 'klassesCtrl', 'klassCtrl', 'services', 'studentKlassesCtrl', 'klassRosterCtrl', 'studentKlassRosterCtrl', 'klassAboutCtrl','studentKlassAboutCtrl', 'studentKlassCtrl', 'ngLetterAvatar', 'assignmentsCtrl', 'studentAssignmentsCtrl', 'profileCtrl', 'studentAssignmentDetailsCtrl', 'assignmentDetailsCtrl', 'assignmentsToReviewCtrl', 'assignmentToReviewDetailsCtrl', 'assignmentGroupCtrl']);
//var klassApp = angular.module('klassApp', [ 'services', 'ngRoute']);

  klassApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
     
    $locationProvider.html5Mode(true);

    $routeProvider

        // home page for teachers
        .when('/educate', {
            templateUrl: '/views/educate.html',
            controller: 'klassesCtrl'
        })
        // home page for teachers
        .when('/demohome', {
            templateUrl: '/views/classes.html',
            controller: 'klassesCtrl',
             resolve: {
               factory: isTeacher           
             }      
        })
        // home page for teachers
        .when('/dashboard', {
            templateUrl: '/views/classes.html',
            controller: 'klassesCtrl',
             resolve: {
               factory: isLoggedIn           
             }      
        })
        // profile page during signup - required fields
        .when('/profile-signup', {
            templateUrl: '/views/profile.html',
            controller: 'profileCtrl',
             resolve: {
                 factory: hasAccount,
                 user: function(services, $route){
                  return services.getUserId();
                }
             }      
        })
        // profile page
        .when('/profile', {
            templateUrl: '/views/profile.html',
            controller: 'profileCtrl',
             resolve: {
                 factory: isLoggedIn,
                 user: function(services, $route){
                  return services.getUserId();
                }
             }      
        })
        //home page for students
        .when('/studentdashboard', {
            templateUrl: '/views/studentClasses.html',
            controller: 'studentKlassesCtrl'
        })
        //individual class view for teachers
        .when('/class/:id', {
             templateUrl: '/views/class.html',
             controller: 'klassCtrl',
             resolve: {
               factory: isTeacher,
                user: function(services, $route){
                  return services.getUserId();
                },
                klassRecord: function(services, $route){
                 var klassId = $route.current.params.id;
                 return services.getKlass(klassId);
                },
                assignmentGroupList: function(services, $route){
                  var klassId = $route.current.params.id;
                  return services.getAssignmentGroups(klassId);
                }              
             }
        })
         //individual class view for STUDENTS
        .when('/studentclass/:id', {
             templateUrl: '/views/studentClass.html',
             controller: 'studentKlassCtrl',
             resolve: {
                user: function(services, $route){
                  return services.getUserId();
                },
               klassRecord: function(services, $route){
                 var klassId = $route.current.params.id;
                 return services.getStudentKlass(klassId);
                },
                assignmentList: function(services, $route){
                  var klassId = $route.current.params.id;
                  return services.getStudentAssignments(klassId);
                }              
             }
        })
        //NEW class view for teachers
        .when('/educate/:username/:klassnum', {
             templateUrl: '/views/class.html',
             controller: 'klassCtrl',
             resolve: {
               factory: isTeacher,
                user: function(services, $route){
                  return services.getUserId();
                },
                klassRecord: function(services, $route){
                 var klassnum = $route.current.params.klassnum;
                 var username = $route.current.params.username;
                 return services.getKlass2(username, klassnum);
                },
                assignmentGroupList: function(services, $route){
                 var klassnum = $route.current.params.klassnum;
                 var username = $route.current.params.username;
                 return services.getAssignmentGroups2(username, klassnum);
                }              
             }
        })
        //NEW class about
        .when('/educate/:username/:klassnum/about', {
             templateUrl: '/views/classAbout.html',
             controller: 'klassAboutCtrl',
             resolve: {
               factory: isTeacher,
                user: function(services, $route){
                  return services.getUserId();
                },
                klassRecord: function(services, $route){
                 var klassnum = $route.current.params.klassnum;
                 var username = $route.current.params.username;
                 return services.getKlass2(username, klassnum);
                }           
             }
        })  
    
        //NEW class about
        .when('/educate/:username/:klassnum/students', {
             templateUrl: '/views/classRoster.html',
             controller: 'klassRosterCtrl',
             resolve: {
               factory: isTeacher,
                user: function(services, $route){
                  return services.getUserId();
                },
                klassRecord: function(services, $route){
                 var klassnum = $route.current.params.klassnum;
                 var username = $route.current.params.username;
                 return services.getKlass2(username, klassnum);
                },
                studentList: function(services, $route){
                  //var klassId = $route.current.params.id;
                  return null;
                }          
             }
        })        
    
    //Assignment Group view for teachers
        .when('/class/:classId/ag/:agId', {
             templateUrl: '/views/assignmentGroup.html',
             controller: 'assignmentGroupCtrl',
             resolve: {
               factory: isTeacher,
                user: function(services, $route){
                  return services.getUserId();
                },
                agRecord: function(services, $route){
                 var agId = $route.current.params.agId;
                 return services.getAssignmentGroup(agId);
                },
                //klassRecord: function(services, $route){
                // var klassId = $route.current.params.id;
                // return services.getKlass(klassId);
                //},
                assignmentList: function(services, $route){
                  var agId = $route.current.params.agId;
                  return services.getAssignmentsForGroup(agId);
                }              
             }
        })
    //NEW Assignment Group view for teachers
        .when('/educate/:username/:klassnum/:agnum', {
             templateUrl: '/views/assignmentGroup.html',
             controller: 'assignmentGroupCtrl',
             resolve: {
               factory: isTeacher,
                user: function(services, $route){
                  return services.getUserId();
                },
                agRecord: function(services, $route){
                 var username = $route.current.params.username;
                 var klassnum = $route.current.params.klassnum;
                 var agnum = $route.current.params.agnum;
                 return services.getAssignmentGroup2(username, klassnum, agnum);
                },
                //klassRecord: function(services, $route){
                // var klassId = $route.current.params.id;
                // return services.getKlass(klassId);
                //},
                assignmentList: function(services, $route){
                //  var agId = $route.current.params.agId;
                //  return services.getAssignmentsForGroup(agId);
                  return null;
                }              
             }
        })
    //NEW Assignment view for teachers
        .when('/educate/:username/:klassnum/:agnum/:asid', {
             templateUrl: '/views/assignmentDetails.html',
             controller: 'assignmentDetailsCtrl',
             resolve: {
               factory: isTeacher,
                user: function(services, $route){
                  return services.getUserId();
                },
                agRecord: function(services, $route){
                 var username = $route.current.params.username;
                 var klassnum = $route.current.params.klassnum;
                 var agnum = $route.current.params.agnum;
                 return services.getAssignmentGroup2(username, klassnum, agnum);
                },
                klassRecord: function(services, $route){
                 var klassnum = $route.current.params.klassnum;
                 var username = $route.current.params.username;
                 return services.getKlass2(username, klassnum);
                }
             }
        })
    //individual assignment view for TEACHERS
        .when('/class/:cid/assignment/:aid/details', {
             templateUrl: '/views/assignmentDetails.html',
             controller: 'assignmentDetailsCtrl',
             resolve: {
                user: function(services, $route){
                  return services.getUserId();
                },
                klassRecord: function(services, $route){
                 var klassId = $route.current.params.cid;
                 return services.getKlass(klassId);
                },
                assignmentRecord: function(services, $route){
                  var assignmentId = $route.current.params.aid;
                  return services.getAssignmentDetails(assignmentId);
                }              
             }
        })
         //individual assignment view for STUDENTS
        .when('/studentclass/:cid/assignment/:aid/details', {
             templateUrl: '/views/studentAssignmentDetails.html',
             controller: 'studentAssignmentDetailsCtrl',
             resolve: {
                user: function(services, $route){
                  return services.getUserId();
                },
               klassRecord: function(services, $route){
                 var klassId = $route.current.params.cid;
                 return services.getStudentKlass(klassId);
                },
                assignmentRecord: function(services, $route){
                  var assignmentId = $route.current.params.aid;
                  return services.getStudentAssignmentDetails(assignmentId);
                }              
             }
        })
         //list of studentassignments for TEACHER to review
        .when('/class/:cid/assignment/:aid/review/list', {
             templateUrl: '/views/assignmentsToReview.html',
             controller: 'assignmentsToReviewCtrl',
             resolve: {
                user: function(services, $route){
                  return services.getUserId();
                },
               klassRecord: function(services, $route){
                 var klassId = $route.current.params.cid;
                 return services.getKlass(klassId);
                },
          //      assignmentRecord: function(services, $route){
          //        var assignmentId = $route.current.params.aid;
           //       return services.getStudentAssignmentDetails(assignmentId);
           //     },            
                assignmentList: function(services, $route){
                  var assignmentId = $route.current.params.aid;
                  return services.getStudentAssignmentsToReview(assignmentId);
                }   
            }
        })
        //individual student assignment to review for TEACHERS
        .when('/class/:cid/assignment/:aid/review/details', {
             templateUrl: '/views/assignmentToReviewDetails.html',
             controller: 'assignmentToReviewDetailsCtrl',
             resolve: {
                user: function(services, $route){
                  return services.getUserId();
                },
               klassRecord: function(services, $route){
                 var klassId = $route.current.params.cid;
                 return services.getKlass(klassId);
                },
                assignmentRecord: function(services, $route){
                  var assignmentId = $route.current.params.aid;
                  return services.getStudentAssignmentDetails(assignmentId);
                }              
             }
        })
    //assignment view for teachers
        .when('/assignments', {
             templateUrl: '/views/assignments.html',
             controller: 'assignmentsCtrl',
             resolve: {
               factory: isTeacher,
                assignmentList: function(services, $route){
                  return services.getAllAssignments();
                }              
             }
        })
         // assignment view for STUDENTS
        .when('/studentassignments', {
             templateUrl: '/views/studentAssignments.html',
             controller: 'studentAssignmentsCtrl',
             resolve: {
                assignmentList: function(services, $route){
                  return services.getAllStudentAssignments();
                }              
             }
        })
    //list of students
        .when('/class/:id/students', {
             templateUrl: '/views/classRoster.html',
             controller: 'klassRosterCtrl',
             resolve: {
                factory: isTeacher,
                user: function(services, $route){
                  return services.getUserId();
                },
               klassRecord: function(services, $route){
                 var klassId = $route.current.params.id;
                 return services.getKlass(klassId);
                },
                studentList: function(services, $route){
                  var klassId = $route.current.params.id;
                  return services.getStudentsInKlass(klassId);
                }
             }
        })
    //list of students for STUDENTS
        .when('/studentclass/:id/students', {
             templateUrl: '/views/studentClassRoster.html',
             controller: 'studentKlassRosterCtrl',
             resolve: {
                user: function(services, $route){
                  return services.getUserId();
                },
               klassRecord: function(services, $route){
                 var klassId = $route.current.params.id;
                 return services.getStudentKlass(klassId);
                },
                studentList: function(services, $route){
                  var klassId = $route.current.params.id;
                  return services.getStudentsInKlass(klassId);
                }
             }
        })
    //about the class
        .when('/class/:id/about', {
             templateUrl: '/views/classAbout.html',
             controller: 'klassAboutCtrl',
             resolve: {
              factory: isTeacher,
              user: function(services, $route){
                  return services.getUserId();
                },
               klassRecord: function(services, $route){
                 var klassId = $route.current.params.id;
                 return services.getKlass(klassId);
                }
             }
        })
    //about the class - STUDENT VIEW
        .when('/studentclass/:id/about', {
             templateUrl: '/views/studentClassAbout.html',
             controller: 'studentKlassAboutCtrl',
             resolve: {
              user: function(services, $route){
                  return services.getUserId();
                },
               klassRecord: function(services, $route){
                 var klassId = $route.current.params.id;
                 return services.getStudentKlass(klassId);
                }
             }
        })
      .otherwise({
            //templateUrl: '/views/classes.html',
            //controller: 'klassesCtrl'
              //redirectTo: function() {
              //  window.location = "404.html";
              //  window.location.replace(url);

              //}
              redirectTo: '/dashboard'
             //templateUrl: '/views/404.html'//,
             //controller: 'AdminController'
        });

 //$locationProvider.html5mode({ enabled: true, baseLocation: false});
    }])

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('deep-orange');
});
  

klassApp.directive('nameunique', function($q, $timeout, $http){
  return {
    restrict: 'A',
    require: 'ngModel',
    /* 
       The link function allows us to attach a DOM listener and update the DOM when needed. In this case, 
       we want to update the DOM as we're typing and notify if the username is used or not.
       ctrl = ngModelController
       by setting the require: 'ngModel', this pass the ngModelController as the 4th parameter.
     */
    link: function(scope, elm, attrs, ctrl){
    
         var orig_name = attrs.nameunique;
     //var usernames = ['Champs82','Starbucks91', 'Panera93'];
      /* Used to perform asyncronous validation on the username directive. */

      ctrl.$asyncValidators.nameunique = function(modelValue, viewValue){
       

        if(ctrl.$isEmpty(modelValue)){
          // consider empty model value
          return $q.when();
        }

        
        var def = $q.defer();
        def.notify('Querying the jsonplaceholder.typicode.com service')
        $http({method: 'GET', url: '/api/user/username/'+modelValue+'' }).then(
          function(response){
            

            if((!response.data) || (response.data && response.data.username == orig_name)){
              //ngModel.$setValidity('nameunique', true)
               def.resolve();    
            }
            else{
               //ngModel.$setValidity('nameunique', false)
               def.reject();
            }
            
          }, 
          function(response){
            //alert("O no, you a problem man!!!");
          }
        );

        
        return def.promise;
      };
    }
  };
});





klassApp.filter('reverse', function() {
  return function(items) {
    if (!angular.isArray(items)) {return items;}
    else {return items.slice().reverse();}
  };
});

var isTeacher = function ($q, $rootScope, $location, $http) {

var ful = $location.path();
var t;

if (ful.lastIndexOf("/") > 0) {
    t = ful.substring(1, ful.indexOf("/", 1));
} else {
    t = ful.substring(1);
}

var n = ful.replace(t, "student"+t);

  
var deferred = $q.defer();
    $http.get("/api/userid")
        .success(function (response) {
            var userType = response.userType;
            if (userType == 'student') { $location.path(n); }
            else {deferred.resolve(true);}
        })
        .error(function () {
            deferred.reject();
           // $location.path($location.path());
         });
    return deferred.promise;
};


var hasAccount = function ($q, $rootScope, $location, $http) {

  
var deferred = $q.defer();
    $http.get("/api/userid")
        .success(function (response) {
            //var firstName = response.firstName;
            if (response.username) { 
              if (response.userType == 'teacher')
                $location.path('/dashboard');
              else
                $location.path('/studentdashboard');
            }
            else {deferred.resolve(true);}
        })
        .error(function () {
            deferred.reject();
           // $location.path($location.path());
         });
    return deferred.promise;
};

var isLoggedIn = function ($q, $rootScope, $location, $http) {
  
    var deferred = $q.defer();
    $http.get("/api/userid")
        .success(function (response) {
            //var firstName = response.firstName;
            if (response.username) { deferred.resolve(true);}
            else {$location.path('/educate/');}
        })
        .error(function () {
            deferred.reject();
           // $location.path($location.path());
         });
    return deferred.promise;
};

//  .filter('startFrom', function(){
//
//    return function(data, start){
//         if (!data || !data.length) { return; }
//        return data.slice(start);
//    }

//  })

