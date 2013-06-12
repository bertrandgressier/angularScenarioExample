'use strict'
;
angular.module('ase').controller('AngularScenarioExample',function($scope){

    $scope.title='Angular scenario Example';


    $scope.examples=[{name:'example 1', value:123},
        {name:'example 2', value:456},
        {name:'example 3', value:789},
        {name:'example 4', value:980}];

});