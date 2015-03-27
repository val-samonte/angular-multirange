angular-multirange
===================

AngularJS slider component with multiple thumbs support. This fork has following new features

1. Colors for the thumb portions, or a gradient at the thumb spot
2. Edtiable labels
3. Thumbs will not overlap and stop when collide

###Preview
![Preview](https://github.com/ahmadalibaloch/angular-multirange/blob/master/demo/sliderpic.png)

###Install
```
bower install angular-multirange
```
Include both multirange.js and multirange.css, then add `vds.multirange` to your `angular.module` dependencies.

###Usage
```html
<vds-multirange ng-model="rangeArray" view="viewIndex"></vds-multirange>
<vds-multirange ng-model="rangeArray" view="viewIndex" gradient="true"></vds-multirange>
```
rangeArray:
```javascript
$scope.rangeArray = [
     { value: 0.20, name: 'Clock In',color:'red' },
     { value: 0.40, name: 'Start Break',color:'green' },
     { value: 0.66, name: 'End Break' ,color:'blue'},
     { value: 0.80, name: 'Clock Out' ,color:'yellow' },
     { value: 0.90, name: 'Clock Out' ,color:'cyan' },
     { value: 0.50, name: 'Clock Out' ,color:'brown' }
    ];
```

###vds-multirange sample view configuration
```javascript
$scope.views = [
  {
    zoom: 0.9,
    step: 1/40,
    // visible units for this view, first entry being the major unit
    units: [
      {
        value: 1/10,
        // function to transform your value into labels | true: value itself | false: none
        labeller: function (n) { return n*10 } 
      },
      {
        value: 1/20,
      }
    ]
  },
  {
    zoom: 1.5,
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
];
```
then apply the view configuration using the views attribute.
```html
<vds-multirange ng-model="rangeArray" view="viewIndex" views="views"></vds-multirange>
```
##vds-multirange-lite
A light version of the slider also comes with this module which excludes labels, unit of measures, zooming and views.
```html
<vds-multirange-lite ng-model="rangeArray"></vds-multirange-lite>
```
