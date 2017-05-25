myApp.controller('MeetingsController',
  ['$scope', '$rootScope','$firebaseAuth', '$firebaseArray',
  function($scope, $rootScope, $firebaseAuth, $firebaseArray) {

    var ref = firebase.database().ref();
    var auth = $firebaseAuth();

    auth.$onAuthStateChanged(function(authUser) {
      if(authUser) {
        var drugsRef = ref.child('drugs');
        var drugsInfo = $firebaseArray(drugsRef);

        $scope.drugs = drugsInfo;

        drugsInfo.$loaded().then(function(data) {
          $rootScope.howManyDrugs = drugsInfo.length;
        }); // make sure drug data is loaded



        drugsInfo.$watch(function(data) {
          $rootScope.howManyDrugs = drugsInfo.length;
        });

        $scope.addDrug = function() {
          drugsInfo.$add({
            name: $scope.drugname,
            genericname: $scope.genericname,
            category: $scope.drugcategory,
            drugstrength: $scope.drugstrength,
            date: firebase.database.ServerValue.TIMESTAMP
          }).then(function() {
            $scope.drugname='';
            $scope.drugcategory='';
            $scope.genericname='';
            $scope.drugstrength='';
          }); //promise
        } //addDrug

        $scope.deleteDrug = function(key) {
          drugsInfo.$remove(key);
        } //deleteDrug

      } //authUser
    }); //onAuthStateChanged
}]); //myApp.controller
