angular-multirange
===================

Multiple input[type="range"] as AngularJS directive

###Todo
* SASS
* minified version
* optimization
* documentation

###multirange-mk2 example options
```javascript
$scope.options = {
  zoom: {
    index: 0, // index for levels
    levels: [
      {
        value: 0.9, // zoom value for this level
        step: 1/40, // step value
        units: [ // visible units for this level
          {
            value: 1/10, // unit value
            labeller: function (n) { return n*10 } // function to transform your value into labels | true: value itself | false: none
          },
          {
            value: 1/20,
          }
        ]
      },
      {
        value: 1.5,
        step: 1/80,
        units: [
          {
            value: 1/20,
            labeller: function (n) { return n*10 }
          },
          {
            value: 1/40,
          }
        ]
      }
    ]
  }
};
```