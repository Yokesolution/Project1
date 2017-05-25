myApp.factory('Authentication',
  ['$rootScope', '$location', '$firebaseObject', '$firebaseAuth',
  function($rootScope, $location, $firebaseObject, $firebaseAuth) {

  var ref = firebase.database().ref();
  var auth = $firebaseAuth();
  var myObject;

  //$rootScope.isadmin = 1;

  auth.$onAuthStateChanged(function(authUser) {
    if(authUser) {
      var userRef = ref.child('users').child(authUser.uid);
      var userObj = $firebaseObject(userRef);
      $rootScope.currentUser = userObj;
      $rootScope.loggedIn = true; 
    } else {
      $rootScope.currentUser = '';
    }
  });

  myObject = {
    login: function(user) {
      auth.$signInWithEmailAndPassword(
        user.email,
        user.password
        
      ).then(function(user, $scope, $rootScope) { 

        $location.path('/profile');
      }).catch(function(error) {
        $rootScope.message = error.message;
      }); //signInWithEmailAndPassword
    }, //login

    logout: function() {
      $rootScope.loggedIn = false; 
      return auth.$signOut();
    }, //logout

    requireAuth: function() {
      return auth.$requireSignIn();
    }, //require Authentication

    register: function(user) {
      
      //$scope.isadmin = "1";

      auth.$createUserWithEmailAndPassword(
        user.email,
        user.password
      ).then(function(regUser) {
        //Get lon and lat from address
        var geocoder = new google.maps.Geocoder();
        var address = user.address;

        geocoder.geocode( { 'address': address}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {

            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            } 

             const regRef = ref.child('pharmacy')
              .child(regUser.uid).set({
                date: firebase.database.ServerValue.TIMESTAMP,
                userid: regUser.uid,
                pharamcyname: user.pharamcyname,
                lat: latitude,
                log: longitude,
                address : user.address,
                name: user.fullname,
                telephone: user.telephone

              }); //userinfo
              //console.log(latitude);
              //myObject.login(user);
        }); 
              const regRefUser = ref.child('users')
                .child(regUser.uid).set({
                    date: firebase.database.ServerValue.TIMESTAMP,
                    userid: regUser.uid,
                    address : user.address,
                    name: user.fullname,
                    email: user.email,
                    telephone: user.telephone,
                    pharamcyname: user.pharamcyname,
                    openhours: user.openhours
                  }); //userinfo
                  //console.log(latitude);
                  myObject.login(user);
        
          $location.path('/profile');       
      }).catch(function(error) {
        $rootScope.message = error.message;
      }); //createUserWithEmailAndPassword
    } //register

  }; //return


  return myObject;

}]); //factory
