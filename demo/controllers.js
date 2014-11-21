'use strict';

angular.module('multirangeDemo')
  .controller('DemoCtrl', function ($scope) {

    // populate some data
    $scope.rangeArray = [
      { value: 0.1, name: 'Clock In' },
      { value: 0.4, name: 'Start Break' },
      { value: 0.6, name: 'End Break' },
      { value: 0.8, name: 'Clock Out' }
    ];

    $scope.options = {
      zoom: {
        index: 0, // index for levels
        levels: [
          {
            value: 0.9, // zoom value for this level
            units: [ // visible units for this level
              {
                value: 1/10,
                labeller: function (n) { return n*10 } // function to transform your value into labels | true: value itself | false: none
              },
              {
                value: 1/20,
              }
            ],
            step: 1/40 // step value
          },
          {
            value: 1.5,
            units: [
              {
                value: 1/20,
                labeller: function (n) { return n*10 }
              },
              {
                value: 1/40,
              }
            ],
            step: 1/80
          }
        ]
      }
    };


    $scope.add = function () {
      $scope.rangeArray.push({ value: parseFloat($scope.entry), name: '' });
    };

  });
