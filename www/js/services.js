angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})


  .factory('Login', function($http) {
    var config = {
      headers : {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    var url='http://multimedia.uoc.edu/frontend/auth.php';

    return {
      enter: function(usuario, pass) {

        var dataStr = "user="+usuario+"&"+"passwd="+pass;
        console.log(dataStr);
        return $http.post(url, dataStr, config);
          //.success(function (data, status, headers, config) {
          //  console.log(data.status);
          //  return data.status;
          //})
          //.error(function (data, status, header, config) {
          //  return 'KO';
          //});
      }
    };
  })


  .factory('Libros', function($http) {
    var config = {
      headers : {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    var url='http://multimedia.uoc.edu/frontend/getbooks.php';

    return {
      getLista: function(pagina) {

        var dataStr = "page="+pagina;
        console.log(dataStr);
        return $http.post(url, dataStr, config);

      }
    };
  });
