/*
The MIT License (MIT)

Copyright (c) 2014 Val Allen Samonte

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict';

angular.module('vds.multirange.mk2', ['vds.multirange'])
  .directive('vdsMultirangeMk2', function () {
    return {
      required: 'ngModel',
      scope: {
        ngModel: '=',
        options: '='
      },
      template:
      '<div class="vds-multirange-mk2-container">' +
        '<vds-multirange-mk2-labels render="renderedStyle" ng-model="ngModel"></vds-multirange-mk2-labels>' +
        '<vds-multirange ng-model="ngModel" ng-style="renderedStyle.multirange" step="step"></vds-multirange>' +
        '<vds-multirange-mk2-hairlines render="renderedStyle" ng-model="units"></vds-multirange-mk2-hairlines>' +
      '</div>',
      link: function (scope, elem, attr) {

        scope.getPercent = function(value) {
          return (value*100) + '%';
        };

        scope.$watch('options.zoom.index', function (n) {
          var l = scope.options.zoom.levels.length-1, level;
          n = (n < 0)? 0 : ( (n > l)? l : n );
          level = scope.options.zoom.levels[scope.options.zoom.index];
          scope.zoom = level.value;
          scope.step = level.step;
          scope.units = level.units;
          scope.renderer();
        });

        scope.renderer = function () {
          if(typeof scope.zoom == 'undefined') return;
          var render = {
            container: {},
            content: {},
            multirange: {
              width: scope.getPercent(scope.zoom),
              display: 'block',
              margin: 'auto'
            }
          };

          if(scope.zoom < 1) {
            render.content.margin = '2 auto';
            render.content.width = 'calc('+scope.getPercent(scope.zoom)+' - 10px)';
            render.container.marginLeft = '0';
          } else {
            render.content.margin = '2 0';
            render.content.width = 'calc('+scope.getPercent(scope.zoom)+' - '+ ( 10 - ( scope.zoom * 5 ) ) +'px)';
            render.container.marginLeft = '5px';
          }
          return scope.renderedStyle = render;
        };

      }
    };
  })
  .directive('vdsMultirangeMk2Labels', function () {
    return {
      restrict: 'E',
      scope: {
        ngModel: '=',
        render: '='
      },
      template:
      '<div class="vds-multirange-mk2-labels-container" ng-style="render.container">' +
        '<ul class="vds-multirange-mk2-labels" ng-style="render.content">' +
          '<li class="vds-multirange-mk2-label" ng-repeat="range in ngModel" ng-style="renderRange(range)">' +
            '<span ng-show="range.name">{{ range.name }}</span>' +
          '</li>' +
        '</ul>' +
      '</div>',
      link: function (scope, elem, attr) {
        scope.renderRange = function (range) {
          return {
            left: (range.value*100)+'%',
            zIndex: range.depth
          }
        }
      }
    }
  })
  .directive('vdsMultirangeMk2Hairlines', function () {
    return {
      restrict: 'E',
      scope: {
        ngModel: '=',
        render: '='
      },
      template:
      '<div class="vds-multirange-mk2-hairlines-container" ng-style="render.container">'+
        '<ul class="vds-multirange-mk2-hairlines" ng-style="render.content">' +
          '<li class="vds-multirange-mk2-hairline" ng-repeat="hairline in hairlines" ng-style="hairline.render">' +
            '<span>{{ hairline.label }}</span>' +
          '</li>' +
        '</ul>' +
      '</div>',
      link: function (scope, elem, attr) {

        scope.$watch('ngModel', function (n) {
          if(typeof n == 'undefined') return;
          scope.hairlines = [];
          var levels = n.length, hairHeight = 12, hairline, i, j, u;
          for(i = 0; i < levels; i++) {
            u = n[i];
            for( j = 0; j<=1; j = parseFloat((j + u.value).toFixed(8)) ) {
              hairline = {
                render: {
                  height: hairHeight * (1 - i / levels),
                  left: (j*100)+'%'
                }
              }
              if(typeof u.labeller == 'function') {
                hairline.label = u.labeller(j);
              } else if(typeof u.labeller != 'undefined') {
                hairline.label = j;
              }
              scope.hairlines.push(hairline);
            }
          }
        });

      }
    };
  });

angular.module('vds.multirange', [])
  .directive('vdsMultirange', function () {
    return {
      required: 'ngModel',
      scope: {
        ngModel: '=',
        step: '='
      },
      template:
      '<div class="vds-multirange-container" ng-mousemove="onMouseMove($event)">' +
        '<div class="vds-multirange-track"></div>' +
        '<div class="vds-multirange-wrapper" ng-repeat="range in ngModel" ng-style="computeDepth(range)">' +
          '<vds-range class="vds-multirange" position="range.value" min="0" max="{{ precision }}" step="{{ preciseStep }}">' +
        '</div>' +
      '</div>',
      link: function (scope, elem, attr) {
        var mousex;
        scope.precision = 1000000;
        scope.preciseStep = 1;
        scope.onMouseMove = function (evt) {
          var bound = elem[0].getBoundingClientRect();
          mousex = (evt.pageX - bound.left) / bound.width;
        };
        scope.computeDepth = function (range) {
          range.depth = 100 - Math.round(Math.abs(mousex-range.value)*100);
          return {
            zIndex: range.depth
          };
        };
        scope.$watch('step', function () {
          if(typeof scope.step == 'undefined') {
            scope.preciseStep = 1;
          } else {
            scope.preciseStep = scope.step * scope.precision;
          }
        });
      }
    };
  })
  .directive('vdsRange', function ($timeout) {
    return {
      template: '<input type="range" ng-model="rdh.mulValue">',
      restrict: 'E',
      replace: true,
      scope: {
        position: '='
      },
      link: function (scope, elem, attr) {
        var RangeDataHelper = function(value, multiplier) {
          this.value = isNaN(value)? 0 : value;
          this.multiplier = multiplier;
          Object.defineProperty(this, 'mulValue', {
            get: function() {
              return (parseFloat(this.value) * this.multiplier) +'';
            },
            set: function(n) {
              this.value = parseInt(n) / this.multiplier;
              scope.position = this.value;
            }
          });
        };
        scope.$watch('position', function (n) {
          if(typeof scope.rdh == 'undefined') {
            scope.rdh = new RangeDataHelper(n, parseInt(attr.max) || 100);
          } else {
            // scope.rdh.multiplier = parseInt(attr.max) || 100;
            scope.rdh.value = n;
          }
        });
      }
    }
  });
