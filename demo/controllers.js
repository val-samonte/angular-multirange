'use strict';

angular.module('multirangeDemo')
  .controller('DemoCtrl', function ($scope) {
    // populate some data
    $scope.rangeArray = [
      { value: 0.1, name: 'Clock In' },
      { value: 0.4, name: 'Start Break' },
      { value: 0.6, name: 'End Break' },
      { value: 0.8, name: 'Clock Out' },
//      new vdsRangeMarker(0.2, 'Test value')
    ];

    $scope.add = function () {
      $scope.rangeArray.push({ value: parseFloat($scope.entry), name: '' });
    };

  });
