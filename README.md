angular-multirange
===================

AngularJS slider component with multiple thumbs support.

###Install
```
bower install val-samonte/angular-multirange
```
Include both multirange.js and multirange.css, then add `vds.multirange` to your `angular.module` dependencies.

###Usage
```html
<vds-multirange ng-model="rangeArray" view="viewIndex"></vds-multirange>
```
rangeArray:
```javascript
$scope.rangeArray = [
  { value: 0.2, name: 'Clock In' },
  { value: 0.4, name: 'Start Break' },
  { value: 0.6, name: 'End Break' },
  { value: 0.8, name: 'Clock Out' }
]
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