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


.controller('LoginCtrl', ['$scope','$ionicPopup', '$state', 'Login', function($scope, $ionicPopup, $state, Login) {
  $scope.logindata = {};

  $scope.login = function() {


    Login.enter($scope.logindata.username, $scope.logindata.password)
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
}])

.controller('LibrosCtrl', function($scope, $ionicPopup, Libros) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  //Pagina cargada actualmente
  $scope.paginaLibros=1;
 // $scope.listaLibros=new Array();
  //Mensajes de error
  var errordatos='No se pudieron leer los datos';
  var tituloerror='Error';
  //Llamamos al servicio
  //Si es correcto, establecemos el array en el scope
  //Si no sacamos un alert con el error
  Libros.getLista($scope.paginaLibros)
    .success(function (data, status, headers, config) {
      if(data.status!='KO'){
        $scope.listaLibros=data;
      }else{
        $ionicPopup.alert({
          title: tituloerror,
          template: errordatos
        });
      }
    })
    .error(function (data, status, header, config) {
      $ionicPopup.alert({
        title: tituloerror,
        template: errordatos
      });
    });

 //Funcion para cargar mas libros
  $scope.cargarMasLibros = function(){
    console.log("cargarMasLibros");
    Libros.getLista(++$scope.paginaLibros)
      .success(function (data, status, headers, config) {
        if(data.status!='KO'){
          console.log("lista: " + $scope.listaLibros);
          $scope.listaLibros.concat(data);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }else{
          $ionicPopup.alert({
            title: tituloerror,
            template: errordatos
          });
        }
      })
      .error(function (data, status, header, config) {
        $ionicPopup.alert({
          title: tituloerror,
          template: errordatos
        });
      });

  }

});
