myApp.controller('PharmacyController',
  ['$scope', '$rootScope','$firebaseAuth', '$firebaseArray',
  function($scope, $rootScope, $firebaseAuth, $firebaseArray) {

    var ref = firebase.database().ref();
    var auth = $firebaseAuth();

    auth.$onAuthStateChanged(function(authUser) {
      if(authUser) {
        var pharmacyRef = ref.child('pharmacy');
        var pharmacyInfo = $firebaseArray(pharmacyRef);

        $scope.drugs = pharmacyInfo;

        pharmacyInfo.$loaded().then(function(data) {
          $rootScope.howManyDrugs = pharmacyInfo.length;
        }); // make sure drug data is loaded



        pharmacyInfo.$watch(function(data) {
          $rootScope.howManyDrugs = pharmacyInfo.length;
        });

        $scope.addpharmacy = function() {
          pharmacyInfo.$add({
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
          pharmacyInfo.$remove(key);
        } //deleteDrug

      } //authUser
    }); //onAuthStateChanged
}]); //myApp.controller
