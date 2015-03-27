'use strict';

angular.module('multirangeDemo')
  .controller('DemoCtrl', function ($scope, vdsMultirangeViews) {

    // populate some data
    $scope.rangeArray = [
     { value: 0.20, name: 'Clock In',color:'red' },
     { value: 0.40, name: 'Start Break',color:'green' },
     { value: 0.66, name: 'End Break' ,color:'blue'},
     { value: 0.80, name: 'Clock Out' ,color:'yellow' },
	 { value: 0.90, name: 'Clock Out' ,color:'cyan' },
	 { value: 0.50, name: 'Clock Out' ,color:'brown' }
    ];

    $scope.views = vdsMultirangeViews.TIME;

    $scope.add = function () {
      $scope.rangeArray.push({ value: parseFloat($scope.entry), name: 'Test entry',color:$scope.entryColor });
    };

  });
