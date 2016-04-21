angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


.controller('LoginCtrl', ['$scope', '$http','$ionicPopup', '$state', function($scope, $http, $ionicPopup, $state) {
  $scope.logindata = {};

  $scope.login = function() {
    console.log("LOGIN user: " + $scope.logindata.username + " - PW: " + $scope.logindata.password);
    var dataStr = "user="+$scope.logindata.username+"&"+"passwd="+$scope.logindata.password;
    var config = {
      headers : {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };


    $http.post('http://multimedia.uoc.edu/frontend/auth.php', dataStr, config)
      .success(function (data, status, headers, config) {

        //console.log("Status: " + status);
        //console.log("Data: " + JSON.stringify(data));
        if(data.status=='OK'){
          $state.go('tab.dash');
        }else{
          $ionicPopup.alert({
            title: 'Error',
            template: 'Nombre de usuario o contraseña incorrectos'
          });
        }
      })
      .error(function (data, status, header, config) {
        alert("error: " + status + ': ' +  data);
      });
  }
}]);
