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
.controller('LoginCtrl', ['$ionicPopup', '$state', 'Login', function($ionicPopup, $state, Login) {
  var self=this;

  self.logindata = {};

  //Funcion que se llamara cuando se realice el login
  self.login = function() {
    //Llamamos al servicio de login para que se envien los datos al servidor
    Login.enter(self.logindata.username, self.logindata.password)
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
.controller('LibrosCtrl', ['$ionicPopup', 'Libros', '$scope', function($ionicPopup, Libros, $scope) {
  var self = this;
  //Pagina cargada actualmente
  self.paginaLibros=0;
  //Boolean para indicar si se han cargado todos los libros del servidor
  self.todosCargados=false;
  //Array con todos los libros de la lista
  self.listaLibros=[];

  //Funcion para cargar mas libros. Se le llamara cada vez que se quiera cargar una
  //Pagina nueva
  self.cargarMasLibros = function(){
    //Mensajes de error
    var errordatos='No se pudieron leer los datos';
    var tituloerror='Error';

    //Obtenemos los datos desde el servicio de libros. Le pasamos el siguiente numero de pagina
    Libros.getLista(++self.paginaLibros)
      .success(function (data, status, headers, config) {
        //Si la recepcion de informacion ha sido correcta, tenemos que comprobar el estado
        if(data.status!='KO'){
          //Si no recibimos KO, lo que tenemos en data son los objetos de la lista.
          //Los agregamos a la lista y avisamos de que se ha terminado la accion para
          //el infinite scroll
          for (i in data){
            self.listaLibros.push(data[i]);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }else{
          //Si recibimos KO, lo mas probable es que hayamos alcanzado la ultima
          //pagina, por lo que establecemos a verdadero el valor de la variable
          //Aun asi, si recibimos un KO en la primera pagina, avisamos al usuario de que
          //no se han podido cargar los datos
          self.todosCargados = true;
            if(self.paginaLibros==1){
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

}])

//Controlador para el detalle del libro
  .controller('DetalleLibroCtrl', ['$stateParams', '$ionicPopup', '$ionicPopover', 'DetalleLibro', '$scope', function($stateParams,$ionicPopup, $ionicPopover, DetalleLibro, $scope) {
    var self = this;

    //Mensajes de error
    var errordatos='No se pudieron obtener los datos del libro';
    var tituloerror='Error';

    //Creamos un objeto libro con todos los campos vacios, para evitar posibles problemas con valores nulos
    self.libro = {id:"", title:"", price:"", cover:"", author:"", review:""};

    //Utilizamos un popover para mostrar con mas detalle la parte de la review.
    //Aqui lo inicializamos
    $ionicPopover.fromTemplateUrl('review-popover.html', {
      scope: $scope
    }).then(function(popover) {
      self.popover = popover;
    });

    //Tratamos de obtener los detalles del libro
    DetalleLibro.getDetalles($stateParams.libroId)
      .success(function (data, status, headers, config) {
        //Si la recepcion de informacion ha sido correcta, tenemos que comprobar el estado
        if(data.status!='KO'){
          //Si no recibimos KO, lo que tenemos en data campos del detalle del libro
          //Establecemos los datos como atributo libro
          self.libro = data;
        }else{
          //Si recibimos KO, avisamos al usuario
            $ionicPopup.alert({
              title: tituloerror,
              template: errordatos
            });
        }
      })
      //Si ha fallado la obtencion de datos, avisamos al usuario
      .error(function (data, status, header, config) {
        $ionicPopup.alert({
          title: tituloerror,
          template: errordatos
        });
      });


    //Funcion para abrir el popover cuando se quiera ver la review completa
    self.openPopover = function($event){
      self.popover.show($event);
    };

    //Cierra el popover
    self.closePopover = function() {
      self.popover.hide();
    };

    //Elimina el popover cuando ya no se necesita
    $scope.$on('$destroy', function() {
      self.popover.remove();
    });

    self.agregarLibro = function(){
      //Agregamos al array el id del libro y la cantidad
      //Mostrar mensaje (¿toast?) avisando de la insercion correcta

    };


  }]);
