'use strict';

angular.module('vds.multirange.mk2', ['vds.multirange'])
  .directive('vdsMultirangeMk2', function (vdsZoom) {
    return {
      required: 'ngModel',
      scope: {
        ngModel: '=',
        _zoom: '=zoom',
        _hairlines: '=hairlines'
      },
      template:
'<div class="vds-multirange-mk2-container">' +
'<vds-multirange ng-model="ngModel" style="display: block; margin: auto;" ng-style="{ width: zoom.getPercent() }">' +
'</vds-multirange>' +
'<div class="vds-multirange-mk2-hairlines-container" ng-style="hlcStyle()">'+
'<ul class="vds-multirange-mk2-hairlines" ng-style="hlStyle()">' +
'<li class="vds-multirange-mk2-hairline" ng-repeat="hairline in hairlines" ' +
'ng-style="{ height: hairline.h, left: hairline.x }">' +
'<span>{{ hairline.label }}</span></li>' +
'</ul>' +
'</div>' +
'</div>',
      link: function (scope, elem, attr) {

        // defaults
        scope._hairlines = [1/10, 1/20];
        scope._zoom =  0.96;

        var processHairlines = function () {
          scope.hairlines = [];
          var levels = scope._hairlines.length;
          var hairHeight = 12; // px
          angular.forEach( scope._hairlines, function(item, key) {
            // populate hairlines
            var mark = 0;
            for(var i=0; i<=1; i = parseFloat((i+item).toFixed(8))) {
              var hairline = {
                h: hairHeight * (1 - key / levels),
                x: (i*100)+'%'
              }
              if(key == 0) {
                hairline.label = mark;
                mark++;
              }
              scope.hairlines.push(hairline);
            }
          });
        };
        scope.$watch('_hairlines', function () {
          processHairlines();
        });
        scope.$watch('_zoom', function (n,o) {
          scope.zoom = (scope._zoom instanceof vdsZoom)? scope._zoom : new vdsZoom(scope._zoom);
        });
        scope.hlStyle = function () {
          if(typeof scope.zoom == 'undefined') { return; }
          var style = {};
          if(scope.zoom.value<1) {
            style.margin = '2 auto';
            style.width = 'calc('+scope.zoom.getPercent()+' - 10px)';
          } else {
            style.margin = '2 0';
            style.width = 'calc('+scope.zoom.getPercent()+' - '+ ( 10 - ( scope.zoom.value*5 ) ) +'px)';
          }
          return style;
        };
        scope.hlcStyle = function () {
          if(typeof scope.zoom == 'undefined') { return; }
          return {
            "margin-left": (scope.zoom.value<1)? '0' : '5px'
          }
        };
      }
    };
  })
  .factory('vdsZoom', function () {
    var Zoom = function (value, step) {
      this.value = parseFloat(value);
      this.step = step;
    };
    Zoom.prototype.getPercent = function () {
      return (this.value*100) + '%';
    }
    Zoom.prototype.setPercent = function (stringPercent) {
      this.value = parseInt(stringPercent) / 100;
    }
    return Zoom;
  });

angular.module('vds.multirange', [])
  .directive('vdsMultirange', function (vdsRangeMarker) {
    return {
      required: 'ngModel',
      scope: {
        ngModel: '='
      },
      template:
'<div class="vds-multirange-container" ng-mousemove="onMousemove($event)">' +
'<div class="vds-multirange-track"></div>' +
'<div class="vds-multirange-wrapper" ng-repeat="range in ngModel" ng-style="{ zIndex: computeZ(range.value) }">' +
'<vds-range class="vds-multirange" ng-model="range.multipliedValue" min="0" max="{{ precision }}" title="{{ range.name }}">' +
'</div>' +
'</div>',
      link: function (scope, elem, attr) {
        var posx;
        scope.precision = 1000000;
        scope.$watch('ngModel', function() {
          angular.forEach(scope.ngModel, function (item,key) {
            // todo: fix looping multiplication
            if(!(item instanceof vdsRangeMarker)) {
              scope.ngModel[key] = new vdsRangeMarker(item.value || item, item.name, scope.precision);
            }
          });
        }, true);
        scope.onMousemove = function (evt) {
          var bound = elem[0].getBoundingClientRect()
          posx = (evt.pageX - bound.left) / bound.width;
        };
        scope.computeZ = function (val) {
          return 100 - Math.round(Math.abs(posx-val)*100);
        };
      }
    };
  })
  .factory('vdsRangeMarker', function () {
    var RangeMarker = function (value, name, multiplier) {
      this.value = (isNaN(value))? 0 : value;
      this.multiplier = multiplier || 1;
      this.name = name;
      this.multipliedValue = (parseFloat(this.value) * this.multiplier) +'';
      Object.defineProperty(this, 'multipliedValue', {
        get: function() {
          return (parseFloat(this.value) * this.multiplier) +'';
        },
        set: function(val) {
          this.value = parseInt(val) / this.multiplier;
        }
      });
    };
    return RangeMarker;
  })
  .directive('vdsRange', function ($timeout) {
    return {
      template: '<input type="range">',
      restrict: 'E',
      required: 'ngModel',
      replace: true,
      scope: {
        ngModel: '='
      },
      link: function (scope, elem, attr) {
        // hack: weird first assignment doesn't reflect immediately
        scope.count = 0;
        var uw = scope.$watch('ngModel', function (n) {
          if(scope.count == 0) {
            scope.ngModel = undefined;
            $timeout(function () {
              scope.ngModel = n;
            },10);
            scope.count++;
          } else {
            uw(); // unwatch
            delete scope.count;
          }
        });
      }
    }
  });
