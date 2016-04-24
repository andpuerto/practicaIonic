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

  //Controlador para las funciones de login
.controller('LoginCtrl', ['$scope','$ionicPopup', '$state', 'Login', function($scope, $ionicPopup, $state, Login) {
  $scope.logindata = {};

  //Funcion que se llamara cuando se realice el login
  $scope.login = function() {
    //Llamamos al servicio de login para que se envien los datos al servidor
    Login.enter($scope.logindata.username, $scope.logindata.password)
      .success(function (data, status, headers, config) {
        //Si la atransmision ha sido correcta, comprobamos el estado
        if(data.status=='OK'){
          //Si recibimos OK (login y password correctos), pasamos a la siguiente pantalla
          $state.go('tab.dash');
        }else{
          //Si recibimos un KO avisamos al usuario de que los datos no son correctos
          $ionicPopup.alert({
            title: 'Error',
            template: 'Nombre de usuario o contraseña incorrectos'
          });
        }
      })
      .error(function (data, status, header, config) {
        //Si falla la transmision, avisamos al usuario
        $ionicPopup.alert({
          title: 'Error',
          template: 'No se ha podido contactar con el servidor'
        });
      });
  }
}])


//Controlador para la lista de libros
.controller('LibrosCtrl', function($scope, $ionicPopup, Libros) {
  //Pagina cargada actualmente
  $scope.paginaLibros=0;
  //Boolean para indicar si se han cargado todos los libros del servidor
  $scope.todosCargados=false;
  //Array con todos los libros de la lista
  $scope.listaLibros=[];

  //Funcion para cargar mas libros. Se le llamara cada vez que se quiera cargar una
  //Pagina nueva
  $scope.cargarMasLibros = function(){
    //Mensajes de error
    var errordatos='No se pudieron leer los datos';
    var tituloerror='Error';

    //Obtenemos los datos desde el servicio de libros. Le pasamos el siguiente numero de pagina
    Libros.getLista(++$scope.paginaLibros)
      .success(function (data, status, headers, config) {
        //Si la recepcion de informacion ha sido correcta, tenemos que comprobar el estado
        if(data.status!='KO'){
          //Si no recibimos KO, lo que tenemos en data son los objetos de la lista.
          //Los agregamos a la lista y avisamos de que se ha terminado la accion para
          //el infinite scroll
          for (i in data){
            $scope.listaLibros.push(data[i]);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }else{
          //Si recibimos KO, lo mas probable es que hayamos alcanzado la ultima
          //pagina, por lo que establecemos a verdadero el valor de la variable
          //Aun asi, si recibimos un KO en la primera pagina, avisamos al usuario de que
          //no se han podido cargar los datos
          $scope.todosCargados = true;
            if($scope.paginaLibros==1){
            $ionicPopup.alert({
              title: tituloerror,
              template: errordatos
            });
          }
        }
      })
      //Si ha fallado la obtencion de datos, avisamos al usuario
      .error(function (data, status, header, config) {
        $ionicPopup.alert({
          title: tituloerror,
          template: errordatos
        });
      });

  }

});
