/*
 * goo-ui
 * Version: 4.0.2 - 2014-06-30
 */
angular.module("goo.ui", ["goo.ui.checkbox","goo.ui.collapsible","goo.ui.colorInput","goo.ui.colorPicker","goo.ui.dialogs","goo.ui.dragdrop","goo.ui.dropdownToggle","goo.ui.dropzone","goo.ui.editFoldout","goo.ui.fallbackSrc","goo.ui.fileSelect","goo.ui.floatingLabel","goo.ui.input","goo.ui.inputSlider","goo.ui.keypressHelper","goo.ui.popup","goo.ui.utils","goo.ui.position","goo.ui.progressBar","goo.ui.propertyEdit","goo.ui.resize","goo.ui.select","goo.ui.sortable","goo.ui.tooltip"]);

(function() {
  angular.module('goo.ui.checkbox', []).directive('gooCheckbox', [
    '$timeout', function($timeout) {
      var CHECKED_CLASS, DISABLED_CLASS;
      CHECKED_CLASS = 'checked';
      DISABLED_CLASS = 'disabled';
      return {
        restrict: 'EA',
        require: '?ngModel',
        templateUrl: 'checkbox/checkbox.html',
        link: function($scope, $element, $attr, ngModel) {
          var isDisabled, onClick, onDestroy, toggle, update, _value;
          if (!ngModel) {
            return;
          }
          _value = false;
          isDisabled = function() {
            return $element[0].getAttribute('disabled') === 'disabled';
          };
          update = function() {
            if ($attr.gooBlur) {
              $timeout(function() {
                return $scope.$eval($attr.gooBlur);
              });
            }
            if (_value) {
              return $element.addClass(CHECKED_CLASS);
            } else {
              return $element.removeClass(CHECKED_CLASS);
            }
          };
          toggle = function() {
            _value = !_value;
            update();
            return $scope.$apply(function() {
              return ngModel.$setViewValue(_value);
            });
          };
          onClick = function() {
            if (isDisabled()) {
              return;
            }
            return toggle();
          };
          onDestroy = function() {
            return $element.off('click', onClick);
          };
          ngModel.$render = function() {
            _value = ngModel.$viewValue;
            return update();
          };
          $scope.$on('$destroy', onDestroy);
          $element.on('click', onClick);
          return $scope.$watch(isDisabled, function(value) {
            if (value) {
              return $element.addClass(DISABLED_CLASS);
            } else {
              return $element.removeClass(DISABLED_CLASS);
            }
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('goo.ui.collapsible', []).directive('gooCollapsible', [
    '$rootScope', '$compile', '$parse', function($rootScope, $compile, $parse) {
      return {
        restrict: 'A',
        replace: false,
        link: function($scope, iElem, iAttr) {
          var $clickHeader, attach, clickHeader, collapseExpr, header, onClick, onDestroy;
          header = iElem[0].children[0];
          clickHeader = header;
          collapseExpr = iAttr.gooCollapsible;
          if (!collapseExpr) {
            return;
          }
          $clickHeader = angular.element(clickHeader);
          attach = function() {
            var watch;
            watch = $scope.$watch(collapseExpr, function(nv) {
              var child, fn, i, _i, _len, _ref, _results;
              fn = nv ? 'add' : 'remove';
              header.classList[fn]('collapsed');
              _ref = iElem[0].children;
              _results = [];
              for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
                child = _ref[i];
                if (i > 0) {
                  _results.push(child.classList[fn]('ng-hide'));
                }
              }
              return _results;
            });
            if ($scope._watches != null) {
              return $scope._watches.push(watch);
            }
          };
          onClick = function(event) {
            var hasClick, target;
            target = event.target;
            hasClick = target.attributes.getNamedItem('ng-click');
            if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.tagName === 'A' || hasClick) {
              return;
            }
            $scope.$eval("" + collapseExpr + " = !" + collapseExpr);
            if (!$scope.$$phase && !$rootScope.$$phase) {
              return $scope.$apply();
            }
          };
          onDestroy = function() {
            return $clickHeader.off('click');
          };
          attach();
          $scope.$on('pluginAttached', attach);
          $scope.$on('$destroy', onDestroy);
          return $clickHeader.on('click', onClick);
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('goo.ui.colorInput', ['goo.ui.colorPicker']).directive('gooColorInput', [
    'Popup', function(Popup) {
      var DISABLED_CLASS;
      DISABLED_CLASS = 'disabled';
      return {
        restrict: 'A',
        replace: false,
        scope: {
          color: "=",
          enabled: "=?",
          label: "@",
          gooBlur: "&",
          defaultColor: "=?"
        },
        templateUrl: 'color_input/color-input.html',
        link: function($scope, iElem, iAttr) {
          $scope.originalColor = [0, 0, 0, 1];
          $scope.openPicker = function($event) {
            return Popup.open({
              target: $event.target,
              template: "<div\n	goo-color-picker\n	original-color=\"originalColor\"\n	goo-blur=\"gooBlur()\"\n></div>"
            });
          };
          $scope.toggle = function() {
            return $scope.enabled = !$scope.enabled;
          };
          $scope.reset = function() {
            if ($scope.defaultColor != null) {
              $scope.color = $scope.defaultColor.slice();
            }
            if ($scope.enabled != null) {
              $scope.enabled = true;
            }
            return typeof $scope.gooBlur === "function" ? $scope.gooBlur() : void 0;
          };
          $scope.$watch('enabled', function(nv) {
            if (nv) {
              return iElem.removeClass(DISABLED_CLASS);
            } else {
              return iElem.addClass(DISABLED_CLASS);
            }
          });
          return $scope.$watch('color', function(nv) {
            if (nv != null) {
              return $scope.originalColor = nv;
            }
          });
        }
      };
    }
  ]).filter('rgbaArrayToCss', function() {
    return function(array) {
      if (array != null) {
        return "rgba(" + Math.round(array[0] * 255) + "," + Math.round(array[1] * 255) + "," + Math.round(array[2] * 255) + ",1)";
      }
    };
  });

}).call(this);

(function() {
  angular.module('goo.ui.colorPicker', ['goo.ui.utils']).directive('gooColorPicker', [
    'utils', function(utils) {
      return {
        restrict: 'A',
        replace: false,
        scope: {
          originalColor: '=',
          gooBlur: '&'
        },
        templateUrl: 'color_picker/color-picker.html',
        link: function($scope, iElem, iAttr) {
          var HSVtoRGB, RGBtoHSV, RGBtoHex, drawHueCanvas, drawPreviewCanvas, drawSatCanvas, hexToRGB, init, preventDragStart;
          $scope.HSV = null;
          $scope.RGB = null;
          $scope.hex = null;
          $scope.huePos = -6;
          $scope.satPos = [0, 0];
          $scope.updateFromHSV = function() {
            var color, rgb;
            rgb = HSVtoRGB($scope.HSV);
            color = $scope.originalColor;
            color[0] = $scope.RGB[0] = rgb[0];
            color[1] = $scope.RGB[1] = rgb[1];
            color[2] = $scope.RGB[2] = rgb[2];
            return $scope.hex = RGBtoHex(rgb);
          };
          $scope.updateFromRGB = function() {
            var color, hsv;
            hsv = RGBtoHSV($scope.RGB);
            $scope.HSV[0] = hsv[0];
            $scope.HSV[1] = hsv[1];
            $scope.HSV[2] = hsv[2];
            color = $scope.originalColor;
            color[0] = +$scope.RGB[0];
            color[1] = +$scope.RGB[1];
            color[2] = +$scope.RGB[2];
            return $scope.hex = RGBtoHex($scope.RGB);
          };
          $scope.updateFromHex = function() {
            var color, hsv, rgb;
            rgb = hexToRGB($scope.hex);
            if (!rgb) {
              return;
            }
            color = $scope.originalColor;
            color[0] = $scope.RGB[0] = rgb[0];
            color[1] = $scope.RGB[1] = rgb[1];
            color[2] = $scope.RGB[2] = rgb[2];
            hsv = RGBtoHSV(rgb);
            $scope.HSV[0] = hsv[0];
            $scope.HSV[1] = hsv[1];
            return $scope.HSV[2] = hsv[2];
          };
          preventDragStart = function(e) {
            /*
            			Prevents a weird bug where the slider starts being dragged in some
            			browsers.
            */

            e.preventDefault();
            return e.stopPropagation();
          };
          init = function() {
            var hueCanvas, satCanvas;
            hueCanvas = iElem[0].children[1].children[0];
            drawHueCanvas(hueCanvas);
            hueCanvas.parentElement.addEventListener('mousedown', function(e) {
              var canvasMove, stopDraggingHue;
              canvasMove = function(e) {
                var top, y;
                top = hueCanvas.getBoundingClientRect().top;
                y = e.clientY - top;
                $scope.HSV[0] = utils.clamp(y * 360 / hueCanvas.offsetHeight, 0, 360);
                $scope.updateFromHSV();
                return $scope.$apply();
              };
              iElem.addClass('dragging-hue');
              canvasMove(e);
              document.addEventListener('mousemove', canvasMove);
              stopDraggingHue = function() {
                iElem.removeClass('dragging-hue');
                document.removeEventListener('mousemove', canvasMove);
                document.removeEventListener('mouseup', stopDraggingHue);
                return typeof $scope.gooBlur === "function" ? $scope.gooBlur() : void 0;
              };
              return document.addEventListener('mouseup', stopDraggingHue);
            });
            satCanvas = iElem[0].children[0].children[0];
            satCanvas.parentElement.addEventListener('mousedown', function(e) {
              var canvasMove, stopDraggingSaturation;
              canvasMove = function(e) {
                var left, rect, top, x, y;
                rect = satCanvas.getBoundingClientRect();
                top = rect.top;
                left = rect.left;
                x = e.clientX - left;
                y = e.clientY - top;
                $scope.HSV[1] = utils.clamp(x / satCanvas.offsetWidth, 0, 1);
                $scope.HSV[2] = utils.clamp(1 - y / satCanvas.offsetHeight, 0, 1);
                $scope.updateFromHSV();
                return $scope.$apply();
              };
              iElem.addClass('dragging-sat');
              canvasMove(e);
              document.addEventListener('mousemove', canvasMove);
              stopDraggingSaturation = function() {
                iElem.removeClass('dragging-sat');
                document.removeEventListener('mousemove', canvasMove);
                document.removeEventListener('mouseup', stopDraggingSaturation);
                return typeof $scope.gooBlur === "function" ? $scope.gooBlur() : void 0;
              };
              return document.addEventListener('mouseup', stopDraggingSaturation);
            });
            hueCanvas.parentElement.addEventListener('dragstart', preventDragStart);
            satCanvas.parentElement.addEventListener('dragstart', preventDragStart);
            $scope.$watch('originalColor', function(nv) {
              if (nv) {
                $scope.HSV = RGBtoHSV(nv);
                if ($scope.RGB == null) {
                  $scope.RGB = [];
                }
                $scope.RGB[0] = nv[0];
                $scope.RGB[1] = nv[1];
                $scope.RGB[2] = nv[2];
                return $scope.hex = RGBtoHex(nv);
              }
            });
            $scope.$watch('HSV[0]', function(nv) {
              if (nv != null) {
                $scope.huePos = nv / 360 * hueCanvas.height - 6;
                return drawSatCanvas(satCanvas, nv);
              }
            });
            $scope.$watch('HSV[1]', function(nv) {
              if (nv != null) {
                return $scope.satPos[0] = nv * satCanvas.width - 6;
              }
            });
            return $scope.$watch('HSV[2]', function(nv) {
              if (nv != null) {
                return $scope.satPos[1] = (1 - nv) * satCanvas.height - 6;
              }
            });
          };
          drawSatCanvas = function(canvas, hue) {
            var b, context, gradient, height, left, right, startPointHex, stopPointHex, topLeft, topRight, width, y, _i, _results;
            context = canvas.getContext('2d');
            width = canvas.width;
            height = canvas.height;
            topLeft = [1, 1, 1];
            topRight = HSVtoRGB([hue, 1, 1]);
            left = [0, 0, 0];
            right = [0, 0, 0];
            _results = [];
            for (y = _i = 0; 0 <= height ? _i < height : _i > height; y = 0 <= height ? ++_i : --_i) {
              b = 1 - (y / height);
              left[0] = topLeft[0] * b;
              left[1] = topLeft[1] * b;
              left[2] = topLeft[2] * b;
              right[0] = topRight[0] * b;
              right[1] = topRight[1] * b;
              right[2] = topRight[2] * b;
              startPointHex = RGBtoHex(left);
              stopPointHex = RGBtoHex(right);
              gradient = context.createLinearGradient(0, y, width, y);
              gradient.addColorStop(0, '#' + startPointHex);
              gradient.addColorStop(1, '#' + stopPointHex);
              context.fillStyle = gradient;
              _results.push(context.fillRect(0, y, width, y));
            }
            return _results;
          };
          drawHueCanvas = function(canvas) {
            var context, gradient;
            context = canvas.getContext('2d');
            gradient = context.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0 * 1 / 6, '#ff0000');
            gradient.addColorStop(1 * 1 / 6, "#ffff00");
            gradient.addColorStop(2 * 1 / 6, "#00ff00");
            gradient.addColorStop(3 * 1 / 6, "#00ffff");
            gradient.addColorStop(4 * 1 / 6, "#0000ff");
            gradient.addColorStop(5 * 1 / 6, "#ff00ff");
            gradient.addColorStop(6 * 1 / 6, "#ff0000");
            context.fillStyle = gradient;
            return context.fillRect(0, 0, canvas.width, canvas.height);
          };
          drawPreviewCanvas = function(canvas, originRgb, newRgb) {
            var context, height, width;
            context = canvas.getContext('2d');
            width = canvas.width;
            height = canvas.height;
            context.fillStyle = $scope.rgbToHex(newRgb[0], newRgb[1], newRgb[2]);
            context.fillRect(0, 0, width / 2, height);
            context.fillStyle = $scope.rgbToHex(originRgb[0], originRgb[1], originRgb[2]);
            return context.fillRect(width / 2, 0, width / 2, height);
          };
          HSVtoRGB = function(_arg) {
            var b, f, g, h, i, mod, p, q, r, s, t, v;
            h = _arg[0], s = _arg[1], v = _arg[2];
            h /= 60;
            i = ~~h;
            f = h - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            mod = i % 6;
            r = [v, q, p, p, t, v][mod];
            g = [t, v, v, q, p, p][mod];
            b = [p, p, t, v, v, q][mod];
            return [r, g, b];
          };
          RGBtoHSV = function(_arg) {
            var b, delta, g, h, max, min, r, s, v;
            r = _arg[0], g = _arg[1], b = _arg[2];
            h = 0;
            s = 0;
            v = 0;
            min = 0;
            max = 0;
            if (r >= g && r >= b) {
              max = r;
              min = g > b ? b : g;
            } else if (g >= b && g >= r) {
              max = g;
              min = r > b ? b : r;
            } else {
              max = b;
              min = g > r ? r : g;
            }
            v = max;
            s = max !== 0 ? (max - min) / max : 0;
            if (!s) {
              h = 0;
            } else {
              delta = max - min;
              if (r === max) {
                h = (g - b) / delta;
              } else if (g === max) {
                h = 2 + (b - r) / delta;
              } else {
                h = 4 + (r - g) / delta;
              }
              h = h * 60;
              if (h < 0) {
                h += 360;
              }
            }
            return [h, s, v];
          };
          RGBtoHex = function(_arg) {
            var b, g, r;
            r = _arg[0], g = _arg[1], b = _arg[2];
            r *= 255;
            g *= 255;
            b *= 255;
            return ((1 << 24) + (r << 16) + (g << 8) + b << 0).toString(16).slice(1);
          };
          hexToRGB = function(color) {
            var hexColor, i, m, _i, _results;
            m = color.match(/^#?([0-9a-fA-F]{6})$/);
            if (!m) {
              return null;
            }
            hexColor = m[1];
            _results = [];
            for (i = _i = 0; _i <= 5; i = _i += 2) {
              _results.push(parseInt(hexColor.substr(i, 2), 16) / 255);
            }
            return _results;
          };
          return init();
        }
      };
    }
  ]);

}).call(this);

/*
	This service handles modal dialogs.
	A call to Dialogs.show() or one of the standard dialogs returns a promise
	that resolves when the user closes the dialog.

	Standard dialogs:

	Dialogs.alert(message)
		resolves with true
	Dialogs.confirm(message)
		resolves with true for yes, false for no
	Dialogs.error(message or opts)
		resolves with true

	Custom dialogs:

	Dialogs.show(pluginName, params)
*/


(function() {
  angular.module('goo.ui.dialogs', []).factory('Dialogs', [
    '$document', '$compile', '$rootScope', '$sce', '$q', function($document, $compile, $rootScope, $sce, $q) {
      var Dialogs, deferreds;
      deferreds = {};
      return Dialogs = {
        _dialogs: [],
        _appended: false,
        append: function() {
          var $body, mainScope;
          if (Dialogs._appended) {
            return;
          }
          $body = angular.element(document.querySelectorAll('body'));
          mainScope = $body.scope();
          $body.append($compile("<goo-dialogs></goo-dialogs>")(mainScope));
          return Dialogs._appended = true;
        },
        show: function(pluginName, params) {
          var deferred, dialog, _ref;
          if (params == null) {
            params = {};
          }
          Dialogs.append();
          dialog = (_ref = Dialogs._dialogs.filter(function(d) {
            return d.id === pluginName;
          })) != null ? _ref[0] : void 0;
          if (dialog) {
            dialog.show = true;
          } else {
            dialog = {
              pluginName: pluginName,
              show: true
            };
            Dialogs._dialogs.push(dialog);
          }
          if (pluginName === 'default') {
            dialog.id = Dialogs._dialogs.length;
          } else {
            dialog.id = pluginName;
            $rootScope.$broadcast("pluginAttached." + pluginName);
          }
          _.extend(dialog, params);
          if (!$rootScope.$$phase) {
            $rootScope.$apply();
          }
          deferred = $q.defer();
          deferreds[dialog.id] = deferred;
          return deferred.promise;
        },
        close: function(id, arg) {
          var dialog, idx, _ref, _ref1;
          dialog = (_ref = Dialogs._dialogs.filter(function(d) {
            return d.id === id;
          })) != null ? _ref[0] : void 0;
          if (dialog == null) {
            console.warn("Tried to close " + id + ", but no such dialog was open");
          }
          if (dialog.type != null) {
            idx = Dialogs._dialogs.indexOf(dialog);
            Dialogs._dialogs.splice(idx, 1);
          } else {
            dialog.show = false;
            $rootScope.$broadcast("pluginDetached." + dialog.pluginName);
          }
          if ((_ref1 = deferreds[dialog.id]) != null) {
            _ref1.resolve(arg);
          }
          if (!$rootScope.$$phase) {
            return $rootScope.$apply();
          }
        },
        alert: function() {
          var buttonLabels, buttons, message;
          switch (arguments.length) {
            case 1:
              message = arguments[0];
              break;
            case 2:
              message = arguments[0], buttonLabels = arguments[1];
              break;
            default:
              throw new Error("Cannot alert with " + arguments.length + " arguments");
          }
          buttons = Dialogs._getButtons(buttonLabels);
          return this.show('default', {
            message: message,
            title: 'Information',
            buttons: buttons,
            type: 'alert'
          });
        },
        confirm: function(opts, buttonLabels) {
          var buttons;
          if (typeof opts === 'string') {
            opts = {
              message: opts,
              buttonLabels: buttonLabels
            };
          }
          buttons = Dialogs._getButtons(opts.buttonLabels || ["Yes", "No"]);
          buttons[0].cssClass = 'btn-danger';
          buttons[1].cssClass = 'btn-cancel';
          _.defaults(opts, {
            title: 'Are you sure?',
            type: 'confirm',
            buttons: buttons
          });
          return this.show('default', opts);
        },
        error: function(opts) {
          /*
          			opts:
          				buttonLabels: Array of string
          				errorList Array of Error or string
          */

          var buttons, e;
          if (typeof opts === 'string') {
            opts = {
              message: opts
            };
          }
          buttons = Dialogs._getButtons(opts.buttonLabels);
          _.defaults(opts, {
            listItems: (function() {
              var _i, _len, _ref, _ref1, _results;
              _ref = opts.errorList || [];
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                e = _ref[_i];
                _results.push((_ref1 = e.message) != null ? _ref1 : e);
              }
              return _results;
            })(),
            title: 'Something went wrong!',
            type: 'error',
            buttons: buttons
          });
          return this.show('default', opts);
        },
        embedded: function(source, options) {
          return this.show('default', {
            source: $sce.trustAsResourceUrl(source),
            type: 'embedded',
            width: options.width,
            height: options.height,
            title: options.title || '',
            closeOnOutsideClick: true,
            buttons: options.buttons || [
              {
                label: 'close',
                action: function() {
                  return true;
                }
              }
            ]
          });
        },
        _getButtons: function(labels) {
          var buttons, idx, label, _fn, _i, _len;
          if (labels == null) {
            labels = ['OK'];
          }
          buttons = [];
          _fn = function(label, idx) {
            return buttons.push({
              label: label,
              action: function() {
                return idx === 0;
              }
            });
          };
          for (idx = _i = 0, _len = labels.length; _i < _len; idx = ++_i) {
            label = labels[idx];
            _fn(label, idx);
          }
          buttons[0].cssClass = 'btn-primary';
          return buttons;
        }
      };
    }
  ]).directive('gooDialogs', [
    'Dialogs', '$document', '$sce', function(Dialogs, $document, $sce) {
      return {
        templateUrl: 'dialogs/dialog.html',
        restrict: 'E',
        replace: true,
        scope: true,
        link: function($scope, iElem, iAttr) {
          $scope.dialogs = Dialogs._dialogs;
          $scope.toTrusted = function(htmlString) {
            return $sce.trustAsHtml(htmlString);
          };
          $scope.close = function(arg, $event) {
            var dialog, top;
            if ($event != null) {
              if (typeof $event.stopPropagation === "function") {
                $event.stopPropagation();
              }
            }
            top = ((function() {
              var _i, _len, _ref, _results;
              _ref = $scope.dialogs;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                dialog = _ref[_i];
                if (dialog.show) {
                  _results.push(dialog);
                }
              }
              return _results;
            })()).pop();
            if ((top != null) && ((arg != null) || top.closeOnOutsideClick)) {
              return Dialogs.close(top.id, arg);
            }
          };
          return $document.on('keydown', function($event) {
            var enterKeyCode, escapeKeyCode;
            enterKeyCode = 13;
            escapeKeyCode = 27;
            switch ($event.which) {
              case enterKeyCode:
                return $scope.close(true);
              case escapeKeyCode:
                return $scope.close(false);
            }
          });
        }
      };
    }
  ]);

}).call(this);

/*
Receiving files and draggable objects that are dropped on the html page. Usage:

	<div id="myDropTarget" goo-drop="drop(data, $event)">
		Drop files or objects here
	</div>
*/


(function() {
  var dropcache,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  dropcache = {};

  angular.module('goo.ui.dragdrop', []).directive('gooDrop', [
    '$document', function($document) {
      window.addEventListener('drop dragover dragenter', function(e) {
        var _ref;
        e = (_ref = e.originalEvent) != null ? _ref : e;
        if (!angular.element(e.target).hasClass('drop-target')) {
          e.dataTransfer.dropEffect = "none";
          return e.preventDefault();
        }
      }, false);
      return {
        restrict: 'A',
        link: function($scope, iElem, iAttr) {
          var acceptedTypes, count, disabled, domElem, _ref;
          disabled = false;
          acceptedTypes = (_ref = iAttr.dropAcceptType) != null ? _ref.split(',') : void 0;
          ({
            acceptsType: function(e) {
              var id, type, _ref1;
              e = (_ref1 = e.originalEvent) != null ? _ref1 : e;
              if (e.dataTransfer.files.length) {
                type = 'file';
              } else {
                id = e.dataTransfer.getData('text/plain');
                type = id.split('.').pop();
              }
              return (type != null) && __indexOf.call(acceptedTypes, type) >= 0;
            }
          });
          iElem.addClass('drop-target');
          if (iAttr.dropDisabled != null) {
            $scope.$watch(iAttr.dropDisabled, function(nv, ov) {
              disabled = !!nv;
              if (disabled) {
                return iElem.addClass('goo-drop-disabled');
              } else {
                return iElem.removeClass('goo-drop-disabled');
              }
            });
          }
          count = 0;
          domElem = iElem[0];
          domElem.addEventListener('dragover', function(e) {
            var _ref1;
            e = (_ref1 = e.originalEvent) != null ? _ref1 : e;
            if (e.metaKey) {
              e.dataTransfer.dropEffect = "copy";
            } else {
              e.dataTransfer.dropEffect = "move";
            }
            return e.preventDefault();
          }, false);
          domElem.addEventListener('dragenter', function(e) {
            if (disabled) {
              return;
            }
            if (!acceptedTypes || acceptsType(e)) {
              count++;
              iElem.addClass('drag-over');
            }
            e.preventDefault();
            return e.stopPropagation();
          }, false);
          domElem.addEventListener('dragleave', function(e) {
            if (!disabled) {
              count--;
              if (count <= 0) {
                iElem.removeClass('drag-over');
              }
            }
            e.preventDefault();
            return e.stopPropagation();
          }, false);
          return domElem.addEventListener('drop', function(e) {
            var data, id, _ref1;
            e = (_ref1 = e.originalEvent) != null ? _ref1 : e;
            if (disabled) {
              return;
            }
            if (acceptedTypes && !acceptsType(e)) {
              return;
            }
            count = 0;
            iElem.removeClass('drag-over');
            if (e.dataTransfer.files.length) {
              data = e.dataTransfer.files;
            } else {
              id = e.dataTransfer.getData("text/plain");
              data = dropcache[id] || console.warn("Couldn't find item in drop cache");
              delete dropcache[id];
            }
            $scope.$eval(iAttr.gooDrop, {
              data: data,
              $event: e
            });
            if (!$scope.$$phase) {
              $scope.$apply();
            }
            e.preventDefault();
            return e.stopPropagation();
          }, false);
        }
      };
    }
  ]).directive('gooDrag', function() {
    return {
      restrict: 'A',
      link: function($scope, iElem, iAttr) {
        var domElem;
        $scope.$watch(iAttr.dragDisabled, function(nv, ov) {
          return iElem.attr("draggable", !nv);
        });
        domElem = iElem[0];
        domElem.addEventListener('dragstart', function(e) {
          var data, id, x, _ref, _ref1;
          e = (_ref = e.originalEvent) != null ? _ref : e;
          angular.element(this).addClass('dragging');
          data = $scope.$eval(iAttr.gooDrag);
          id = (data != null ? (_ref1 = data.data) != null ? _ref1.id : void 0 : void 0) || (data != null ? data.id : void 0) || ((function() {
            var _i, _results;
            _results = [];
            for (x = _i = 0; _i <= 8; x = ++_i) {
              _results.push((Math.random() * 16 | 0).toString(16));
            }
            return _results;
          })()).join('');
          dropcache[id] = data;
          e.dataTransfer.setData("text/plain", id);
          return e.dataTransfer.effectAllowed = "moveCopy";
        }, false);
        return domElem.addEventListener('dragend', function(e) {
          return angular.element(this).removeClass('dragging');
        }, false);
      }
    };
  });

}).call(this);

(function() {
  angular.module("goo.ui.dropdownToggle", []).directive('gooDropdown', [
    '$document', function($document) {
      var openElement;
      openElement = null;
      return {
        restrict: 'CA',
        controller: [
          '$scope', '$element', function($scope, element) {
            var ctrl, _onDestroy;
            ctrl = this;
            ctrl.openDropdown = function() {
              element.addClass('open');
              $document.on('click', ctrl.closeDropdown);
              return openElement = element;
            };
            ctrl.closeDropdown = function() {
              if (openElement == null) {
                return;
              }
              openElement.removeClass('open');
              $document.off('click', ctrl.closeDropdown);
              return openElement = null;
            };
            ctrl.toggle = function() {
              var disabled, hasDisabledClass, hasDisabledProp, wasClosed;
              wasClosed = element !== openElement;
              if (openElement != null) {
                ctrl.closeDropdown();
              }
              hasDisabledClass = element.hasClass('disabled');
              hasDisabledProp = element.prop('disabled');
              disabled = hasDisabledClass || hasDisabledProp;
              if (wasClosed && !disabled) {
                return ctrl.openDropdown();
              }
            };
            _onDestroy = function() {
              element.off('$destroy', _onDestroy);
              element.off('click', ctrl.toggle);
              return $document.off('click', ctrl.closeDropdown);
            };
            $scope.$on('$locationChangeStart', ctrl.closeDropdown);
            element.on('$destroy', _onDestroy);
            return null;
          }
        ]
      };
    }
  ]).directive('gooDropdownToggle', [
    function() {
      return {
        restrict: 'CA',
        require: '^gooDropdown',
        link: function($scope, element, attrs, dropDownController) {
          var onDestroy, onToggleClicked;
          onToggleClicked = function(event) {
            if (event) {
              event.preventDefault();
              event.stopPropagation();
            }
            return dropDownController.toggle();
          };
          onDestroy = function() {
            element.off('$destroy', onDestroy);
            return element.off('click', onToggleClicked);
          };
          element.on('click', onToggleClicked);
          return element.on('$destroy', onDestroy);
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('goo.ui.dropzone', []);

}).call(this);

(function() {
  angular.module('goo.ui.editFoldout', []).directive('gooEditFoldout', [
    function() {
      return {
        restrict: 'A',
        transclude: true,
        scope: {
          label: '=',
          labelTip: '@',
          folded: '=?',
          "delete": '@'
        },
        templateUrl: "edit_foldout/edit-foldout.html",
        link: function($scope, element, attrs) {
          if ($scope.folded == null) {
            $scope.folded = true;
          }
          return $scope.doDelete = function() {
            return $scope.$parent.$eval($scope["delete"]);
          };
        }
      };
    }
  ]);

}).call(this);

(function() {
  var isImageOk;

  angular.module('goo.ui.fallbackSrc', []).directive('gooFallbackSrc', [
    function() {
      return {
        link: function(scope, iElement, iAttrs) {
          if (!isImageOk(iElement)) {
            angular.element(iElement).attr('src', iAttrs.gooFallbackSrc);
          }
          return iElement.on('error', function() {
            return angular.element(this).attr('src', iAttrs.gooFallbackSrc);
          });
        }
      };
    }
  ]);

  isImageOk = function(img) {
    if (!img.complete) {
      return false;
    }
    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
      return false;
    }
    return true;
  };

}).call(this);

(function() {
  angular.module('goo.ui.fileSelect', []).directive('gooFileSelect', [
    function() {
      var fileInputElement, formElement;
      formElement = null;
      fileInputElement = null;
      return {
        scope: {
          gooFileSelect: "&"
        },
        restrict: 'A',
        link: function($scope, $element, $attrs) {
          if (formElement == null) {
            formElement = document.createElement('div');
            formElement.id = 'goo-file-select';
            formElement.style.display = 'none';
            formElement.addEventListener('click', function(event) {
              return event.stopPropagation();
            });
            fileInputElement = document.createElement('input');
            fileInputElement.type = 'file';
            formElement.appendChild(fileInputElement);
            document.body.appendChild(formElement);
          }
          return $element.on('click', function(event) {
            var onChange;
            event.stopPropagation();
            if ($attrs.gooMultipleFiles === 'true') {
              fileInputElement.setAttribute('multiple', 'true');
            } else {
              fileInputElement.removeAttribute('multiple');
            }
            fileInputElement.value = '';
            fileInputElement.click();
            onChange = function() {
              fileInputElement.removeEventListener('change', onChange);
              return $scope.gooFileSelect({
                files: fileInputElement.files
              });
            };
            return fileInputElement.addEventListener('change', onChange);
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('goo.ui.floatingLabel', ['goo.ui.position']).controller('floatingLabelCtrl', [
    '$scope', 'Position', function($scope, Position) {
      angular.extend($scope, {
        active: false
      });
      return {
        el: null,
        inputEvents: 'propertychange keyup input paste change',
        generateLabel: function() {
          var id, labelEl, placeholder;
          id = this.el.attr('id');
          placeholder = this.el.attr('placeholder');
          labelEl = document.querySelector("[for='" + id + "'");
          if (labelEl) {
            this.label = angular.element(labelEl);
          } else {
            this.label = angular.element("<label for='" + id + "'>" + placeholder + "</label>");
          }
          return this.el[0].parentNode.insertBefore(this.label[0], this.el[0]);
        },
        wrapInput: function() {
          var position;
          position = Position.position(this.el);
          this.wrapper = this.el.wrap('<div class="floatingLabel-wrapper"></div>').parent();
          return this.wrapper.css('width', position.width + 'px');
        },
        bindInputEvents: function() {
          this.el.on(this.inputEvents, angular.bind(this, this.onInput));
          this.el.on('blur', angular.bind(this, this.onBlur));
          return this.el.on('focus', angular.bind(this, this.onFocus));
        },
        onBlur: function() {
          return this.label.removeClass('floatingLabel-focus');
        },
        onFocus: function() {
          return this.label.addClass('floatingLabel-focus');
        },
        onInput: function() {
          var val;
          val = this.el.val();
          if (this.oldVal === val) {
            return;
          }
          this.oldVal = val;
          if (val) {
            if (!this.active) {
              this.active = true;
              return this.label.addClass('floatingLabel-active').removeClass('floatingLabel-inactive');
            }
          } else {
            if (this.active) {
              this.active = false;
              return this.label.addClass('floatingLabel-inactive').removeClass('floatingLabel-active');
            }
          }
        }
      };
    }
  ]).directive('gooFloatingLabel', [
    function() {
      return {
        restrict: 'A',
        controller: 'floatingLabelCtrl',
        link: function(scope, el, args, ctrl) {
          ctrl.el = el;
          ctrl.wrapInput();
          ctrl.generateLabel();
          ctrl.bindInputEvents();
          return args.$observe('placeholder', function(value) {
            return ctrl.label.text(value);
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  var addListeners, addNumberListeners, parseNumber;

  angular.module("goo.ui.input", []).directive('onEnter', function() {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        return elem.on('keydown', function($event) {
          if ($event.which === 13) {
            return scope.$eval(attrs.onEnter);
          }
        });
      }
    };
  }).directive('input', [
    '$window', '$timeout', function($window, $timeout) {
      return {
        restrict: 'E',
        require: '?ngModel',
        link: function($scope, iElem, iAttr, ngModel) {
          if (ngModel == null) {
            return;
          }
          if (iAttr.type === 'spinner') {
            addNumberListeners($scope, iElem, iAttr, ngModel, $timeout);
          }
          return addListeners($scope, iElem, iAttr, ngModel, $timeout);
        }
      };
    }
  ]);

  addListeners = function($scope, iElem, iAttr, ngModel, $timeout) {
    /*
    	Add event listeners needed by all inputs
    	- revert on escape
    	- blur on enter
    	- execute gooBlur function on blur
    */

    var revert, storedValue;
    storedValue = null;
    revert = function() {
      iElem.val(storedValue);
      ngModel.$setViewValue(storedValue);
      return $scope.$apply();
    };
    iElem.on('focus', function() {
      var _this = this;
      storedValue = ngModel.$modelValue;
      return $timeout((function() {
        return _this.select();
      }), 0);
    });
    iElem.on('keydown', function(e) {
      if (e.keyCode === 13) {
        return iElem[0].blur();
      } else if (e.keyCode === 27) {
        revert();
        return iElem[0].blur();
      }
    });
    return iElem.on('blur', function($event) {
      ngModel.$render();
      return $timeout(function() {
        return $scope.$eval(iAttr.gooBlur);
      });
    });
  };

  addNumberListeners = function($scope, iElem, iAttr, ngModel, $timeout) {
    /*
    	Add all the event listeners needed for a number element.
    	- Makes sure the user doesn't enter anything else than a number
    	- Adds a spinner (click and drag to change value)
    */

    var clamp, clampFloat32, clampInt32, decimal, defaultValue, exponential, fixExp, format, maxDigits, precision, step, type;
    precision = $scope.$eval(iAttr.precision);
    exponential = typeof iAttr.exponential !== 'undefined' ? $scope.$eval(iAttr.exponential) : 'auto';
    decimal = $scope.$eval(iAttr.decimal);
    type = $scope.$eval(iAttr.type);
    if (typeof precision !== 'undefined' && typeof decimal !== 'undefined') {
      throw new Error('Dont use precision and decimal at the same time!');
    }
    if (typeof precision === 'undefined') {
      precision = 'float32';
    }
    maxDigits = 7;
    if (precision === 'float32') {
      maxDigits = 7;
    } else if (precision) {
      maxDigits = parseInt(precision);
    }
    if (isNaN(maxDigits)) {
      throw new Error('invalid precision attribute value');
    }
    clampFloat32 = function(n) {
      return new Float32Array([n])[0];
    };
    clampInt32 = function(n) {
      return new Int32Array([n])[0];
    };
    defaultValue = function() {
      var _ref;
      return (_ref = parseNumber($scope.$eval(iAttr['default']))) != null ? _ref : 0;
    };
    clamp = function(n) {
      var max, min;
      max = parseNumber($scope.$eval(iAttr.max));
      min = parseNumber($scope.$eval(iAttr.min));
      if (max != null) {
        n = Math.min(max, n);
      }
      if (min != null) {
        n = Math.max(min, n);
      }
      return n;
    };
    fixExp = function(n, numZeros) {
      var positive;
      if (typeof n === 'string') {
        n = n.replace('+', '');
      }
      n = Number(n);
      positive = n > 0;
      n = (n + '').replace('-', '') + '';
      return (positive ? '+' : '-') + '' + (n.length === 1 ? '0' : '') + n;
    };
    format = function(val) {
      var a, b, c, exp, hasNonZeroExp, isExp, n, parts, shouldRenderExp, strlen;
      n = parseNumber(val);
      if (n == null) {
        return defaultValue();
      }
      if (decimal) {
        return n.toFixed(decimal);
      }
      n = clamp(Number(n));
      if (maxDigits === 0) {
        return n.toFixed();
      }
      if (precision === 'float32') {
        n = clampFloat32(n);
      }
      if (precision === 'int32') {
        n = clampInt32(n);
      }
      if (isNaN(Number(n)) || Number(n) === Infinity) {
        return defaultValue();
      }
      n = Number(n).toPrecision(maxDigits);
      exp = Number(n).toExponential();
      parts = exp.split('e');
      if (parts) {
        exp = Number(parts[0]) + 'e' + fixExp(parts[1]);
      }
      n = Number(exp);
      strlen = (n + '').length;
      hasNonZeroExp = Number(parts[1]) !== 0;
      isExp = (n + '').indexOf('e') !== -1;
      a = n > 0 && strlen > maxDigits;
      b = n < 0 && strlen > maxDigits;
      c = strlen > exp.length && hasNonZeroExp;
      shouldRenderExp = !(a && b) && c || isExp;
      if (!(exponential === false) && (exponential === true || shouldRenderExp)) {
        n = exp;
      }
      return n + '';
    };
    ngModel.$formatters = [format];
    ngModel.$parsers = [
      function(val) {
        var n;
        n = parseNumber(val);
        if (n != null) {
          return clamp(n);
        } else {
          return defaultValue();
        }
      }
    ];
    iElem.on('blur', function($event) {
      return ngModel.$setViewValue(format(ngModel.$modelValue));
    });
    step = parseNumber(iAttr.step) || 1;
    return iElem.on('mousedown', function(e) {
      var $body, baseX, baseY, basevalue, changed;
      changed = false;
      basevalue = parseNumber(iElem.val()) || 0;
      baseY = e.pageY;
      baseX = e.pageX;
      $body = angular.element(iElem[0].ownerDocument.body);
      $body.on('mousemove', function(e) {
        var movedX, movedY;
        movedY = baseY - e.pageY;
        movedX = baseX - e.pageX;
        iElem.val(format(basevalue + movedY * step));
        ngModel.$setViewValue(format(basevalue + movedY * step));
        changed = true;
        return $scope.$apply();
      });
      return $body.one('mouseup mouseleave', function() {
        $body.unbind('mousemove');
        if (changed) {
          $scope.$eval(iAttr.gooBlur);
        }
        return $body.one('blur', function() {
          return $scope.$eval(iAttr.gooBlur);
        });
      });
    });
  };

  parseNumber = function(str) {
    /*
    	Returns the number denoted by str, or undefined if str is not a number
    */

    if (str == null) {
      return void 0;
    }
    if (typeof str === 'string') {
      str = str.replace(',', '.');
    }
    if (parseFloat(str) == str) {
      return parseFloat(str);
    } else {
      return void 0;
    }
  };

}).call(this);

/*
This directive renders a slider connected to a input.
Configurations :
	bgColor : The background color of the slider "fill" can be configurate using
	label : Label to be displayed on the left of the slider.
	rangeIn : Define the lowest value of the slider/input
	rangeOut : Define the highest value of the slider/input
	sliderValue : Two way binding with the parent ctrl.
*/


(function() {
  angular.module('goo.ui.inputSlider', ['goo.ui.utils']).directive('gooInputSlider', [
    '$timeout', 'utils', function($timeout, utils) {
      return {
        replace: false,
        restrict: 'A',
        scope: {
          label: '@',
          labelTitle: '@',
          model: '=sliderValue',
          gooBlur: "&"
        },
        templateUrl: 'input_slider/input-slider.html',
        link: function($scope, iElem, iAttrs) {
          var DEFAULTS, handle, key, posToValue, preventDragStart, slider, startDraggingHandle, val, valueToPos;
          DEFAULTS = {
            min: 0,
            max: 100,
            precision: 0,
            exponential: false
          };
          slider = iElem[0];
          handle = slider.children[1];
          posToValue = function(pos) {
            if ($scope.exponential) {
              return $scope.min * Math.pow($scope.max / $scope.min, pos);
            } else {
              return pos * ($scope.max - $scope.min) + $scope.min;
            }
          };
          valueToPos = function(value) {
            if ($scope.exponential) {
              return Math.log(value / $scope.min) / Math.log($scope.max / $scope.min);
            } else {
              return (value - $scope.min) / ($scope.max - $scope.min);
            }
          };
          startDraggingHandle = function(e) {
            var moveHandle, moved, pageStart, sliderStart, stopDraggingHandle;
            pageStart = e.pageX;
            moved = false;
            sliderStart = valueToPos($scope.model) * (slider.offsetWidth - handle.offsetWidth);
            moveHandle = function(e) {
              var pos, value;
              moved = true;
              pos = e.pageX - pageStart + sliderStart;
              pos /= slider.offsetWidth - handle.offsetWidth;
              value = posToValue(pos);
              value = utils.clamp(value, $scope.min, $scope.max);
              $scope.model = utils.round(value, $scope.precision);
              return $scope.$apply();
            };
            stopDraggingHandle = function() {
              document.removeEventListener('mousemove', moveHandle);
              document.removeEventListener('mouseup', stopDraggingHandle);
              return typeof $scope.gooBlur === "function" ? $scope.gooBlur() : void 0;
            };
            document.addEventListener('mousemove', moveHandle);
            document.addEventListener('mouseup', stopDraggingHandle);
            return false;
          };
          preventDragStart = function(e) {
            /*
            			Prevents a weird bug where the slider starts being dragged in some
            			browsers.
            */

            e.preventDefault();
            return e.stopPropagation();
          };
          $scope.sliderPos = 0;
          for (key in DEFAULTS) {
            val = DEFAULTS[key];
            $scope[key] = $scope.$parent.$eval(iAttrs[key]);
            if ($scope[key] == null) {
              $scope[key] = val;
            }
          }
          if ($scope.exponential) {
            if ($scope.min <= 0) {
              $scope.min = 0.01;
            }
            if ($scope.max <= $scope.min) {
              $scope.max = Math.ceil($scope.min);
            }
          }
          handle.addEventListener('mousedown', startDraggingHandle);
          handle.addEventListener('dragstart', preventDragStart);
          return $scope.$watch('model', function(nv) {
            var value;
            if (nv == null) {
              return;
            }
            value = utils.clamp(nv, $scope.min, $scope.max);
            return $scope.sliderPos = valueToPos(value);
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  angular.module('goo.ui.keypressHelper', []).factory('KeypressHelper', [
    '$rootScope', '$document', function($rootScope, $document) {
      var KeypressHelper;
      return KeypressHelper = {
        INPUT_TAGS: ['input', 'select', 'textarea'],
        enabled: true,
        addKeyboardShortcuts: function(actionMap) {
          var eventKey, isInInput, keysDown, stopEvent;
          keysDown = [];
          eventKey = (function() {
            var keymap;
            keymap = {
              8: 'backspace',
              9: 'tab',
              13: 'return',
              16: 'shift',
              17: 'ctrl',
              27: 'esc',
              18: 'alt',
              32: 'space',
              39: 'right',
              37: 'left',
              38: 'up',
              40: 'down',
              46: 'del',
              112: 'F1',
              113: 'F2',
              114: 'F3',
              115: 'F4',
              116: 'F5',
              117: 'F6',
              118: 'F7',
              119: 'F8',
              120: 'F9',
              121: 'F10',
              122: 'F11',
              123: 'F12'
            };
            return function(e) {
              return {
                name: keymap[e.which] || String.fromCharCode(e.which).toLowerCase(),
                code: e.which
              };
            };
          })();
          stopEvent = function(e) {
            e.stopPropagation();
            e.preventDefault();
            return false;
          };
          isInInput = function(e) {
            var _ref;
            return (_ref = e.target.tagName.toLowerCase(), __indexOf.call(KeypressHelper.INPUT_TAGS, _ref) >= 0) || e.target.classList.contains('input');
          };
          $document.on('keyup', function(e) {
            var key, _ref;
            if ((_ref = e.which) === 91 || _ref === 93 || _ref === 224) {
              for (key in keysDown) {
                keysDown[key] = false;
              }
            }
            return keysDown[e.which] = false;
          });
          return $document.on('keydown', function(e) {
            var err, k, map;
            if (!KeypressHelper.enabled) {
              if ((e.ctrlKey || e.metaKey) && e.which === 83) {
                return stopEvent(e);
              } else {
                if (isInInput(e) && !e.metaKey) {
                  return true;
                } else {
                  if (e.which === 8) {
                    stopEvent(e);
                  }
                }
                return true;
              }
            }
            if (isInInput(e) && !e.metaKey && !e.ctrlKey) {
              return true;
            } else {
              if (e.which === 8) {
                stopEvent(e);
              }
            }
            if (e.which >= 16 && e.which <= 18) {
              return false;
            }
            k = eventKey(e);
            map = actionMap;
            if (e.metaKey) {
              map = map.meta;
            }
            if ((map != null) && e.ctrlKey) {
              map = map.ctrl;
            }
            if ((map != null) && e.shiftKey) {
              map = map.shift;
            }
            if (map != null ? map[k.name] : void 0) {
              try {
                if (!keysDown[e.which]) {
                  keysDown[e.which] = true;
                  return $rootScope.$apply(map[k.name].call(this, e));
                }
              } catch (_error) {
                err = _error;
                throw err;
              } finally {
                stopEvent(e);
              }
            } else {
              return true;
            }
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('goo.ui.popup', ['goo.ui.utils', 'goo.ui.position', 'goo.ui.domUtils']).factory('Popup', [
    'utils', 'domUtils', 'Position', '$compile', '$timeout', '$document', '$window', '$templateCache', '$http', '$q', function(utils, domUtils, Position, $compile, $timeout, $document, $window, $templateCache, $http, $q) {
      var Popup, body, defaultOptions, isDescendant, openContent, windowHeight, windowWidth;
      body = $document.find('body').eq(0);
      windowHeight = 0;
      windowWidth = 0;
      openContent = null;
      isDescendant = function(parent, child) {
        var node;
        node = child.parentNode;
        while (node !== null) {
          if (node === parent) {
            return true;
          }
          node = node.parentNode;
        }
        return false;
      };
      defaultOptions = {
        backdrop: false,
        placement: 'bottom',
        margin: 10
      };
      return Popup = {
        options: null,
        _backdrop: null,
        _popup: null,
        get: function() {
          if (!Popup._popup) {
            Popup._popup = angular.element('<div goo-popup></div>');
          }
          return Popup._popup;
        },
        getTemplate: function(options) {
          if (options.template != null) {
            return $q.when(options.template);
          }
          return $http.get(options.templateUrl, {
            cache: $templateCache
          }).then(function(result) {
            return result.data;
          });
        },
        position: function(targetEl) {
          var popPosition, prePosition;
          prePosition = Position.positionElements(targetEl, Popup._popup, Popup.options.placement, true);
          popPosition = Position.constrainToScreen(prePosition, Popup._popup, Popup.options.margin);
          Popup.bumped = prePosition.top !== popPosition.top || prePosition.left !== popPosition.left;
          popPosition.top += 'px';
          popPosition.left += 'px';
          return Popup._popup.css(popPosition);
        },
        resize: function() {
          var hDif, height, innerHeight, innerWidth, margin, popEl, popupContent, wDif, width;
          popEl = Popup._popup[0];
          innerHeight = popEl.offsetHeight;
          innerWidth = popEl.offsetWidth;
          height = utils.outerHeight(popEl);
          width = utils.outerWidth(popEl);
          margin = Popup.options.margin;
          popupContent = angular.element(Popup._popup[0].querySelector('.popup-content'));
          if (height > windowHeight) {
            hDif = height - innerHeight;
            popupContent.css('height', windowHeight - margin - hDif + 'px');
          }
          if (width > windowWidth) {
            wDif = width - innerWidth;
            return popupContent.css('width', windowWidth - margin - wDif + 'px');
          }
        },
        destroy: function() {
          if (Popup._popup) {
            Popup._popup.remove();
          }
          if (Popup._backdrop) {
            Popup._backdrop.remove();
          }
          return Popup._popup = Popup._backdrop = null;
        },
        open: function(options) {
          var o, popup, target;
          if (options == null) {
            options = {};
          }
          if (openContent === (options.template || options.templateUrl)) {
            return Popup.dismiss();
          }
          if (!(options.target && (options.template || options.templateUrl))) {
            return;
          }
          Popup.dismiss();
          openContent = options.template || options.templateUrl;
          Popup.options = o = angular.extend({}, defaultOptions, options);
          popup = Popup.get();
          target = angular.element(o.target);
          return Popup.getTemplate(options).then(function(template) {
            var popupDomEl;
            popup.html(template);
            popup.attr('popup-class', o.popupClass);
            popup.attr('placement', o.placement);
            popupDomEl = $compile(popup)(target.scope());
            windowHeight = $window.innerHeight;
            windowWidth = $window.innerWidth;
            body.append(popupDomEl);
            if (o.backdrop) {
              Popup._backdrop = angular.element('<div class="popup-backdrop"></div>');
              body.append(Popup._backdrop);
            }
            return $timeout(function() {
              Popup.resize();
              Popup.position(target);
              if (Popup.bumped) {
                popup.addClass('bumped');
              }
              return $document.on('click', Popup.clickOutside);
            });
          });
        },
        clickOutside: function(e) {
          var popupEl;
          popupEl = Popup.get()[0];
          if (domUtils.isDescendant(popupEl, e.target)) {
            return;
          }
          if (e.button === 0) {
            return Popup.dismiss();
          }
        },
        dismiss: function($event) {
          var popupEl;
          popupEl = Popup.get()[0];
          if (($event != null ? $event.target : void 0) && isDescendant(popupEl, $event.target)) {
            return;
          }
          openContent = null;
          $document.off('click', Popup.clickOutside);
          return Popup.destroy();
        }
      };
    }
  ]).directive('gooPopup', [
    'Popup', '$timeout', function(Popup, $timeout) {
      return {
        restrict: 'EA',
        scope: {
          placement: '@'
        },
        replace: true,
        transclude: true,
        templateUrl: 'popup/popup.html',
        link: function(scope, element, attrs) {
          scope.popupClass = attrs.popupClass || '';
          return $timeout(function() {
            return scope.animate = true;
          });
        }
      };
    }
  ]);

}).call(this);

/*
A set of utility methods that can be use to retrieve position of DOM elements.
It is meant to be used where we need to absolute-position DOM elements in
relation to other, existing elements (this is the case for tooltips, popovers,
typeahead suggestions etc.).
*/


(function() {
  angular.module('goo.ui.position', ['goo.ui.utils']).factory('Position', [
    '$document', '$window', 'utils', function($document, $window, utils) {
      var getStyle, isStaticPositioned, parentOffsetEl;
      getStyle = function(el, cssprop) {
        if (el.currentStyle) {
          return el.currentStyle[cssprop];
        } else {
          if ($window.getComputedStyle) {
            return $window.getComputedStyle(el)[cssprop];
          }
        }
        return el.style[cssprop];
      };
      /*
      	Checks if a given element is statically positioned
      	@param element - raw DOM element
      */

      isStaticPositioned = function(element) {
        return (getStyle(element, "position") || "static") === "static";
      };
      /*
      	returns the closest, non-statically positioned parentOffset of a given element
      	@param element
      */

      parentOffsetEl = function(element) {
        var docDomEl, offsetParent;
        docDomEl = $document[0];
        offsetParent = element.offsetParent || docDomEl;
        while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || docDomEl;
      };
      return {
        /*
        	Provides read-only equivalent of jQuery's position function:
        	http://api.jquery.com/position/
        */

        position: function(element) {
          var boundingClientRect, elBCR, offsetParentBCR, offsetParentEl;
          elBCR = this.offset(element);
          offsetParentBCR = {
            top: 0,
            left: 0
          };
          offsetParentEl = parentOffsetEl(element[0]);
          if (offsetParentEl !== $document[0]) {
            offsetParentBCR = this.offset(angular.element(offsetParentEl));
            offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
            offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
          }
          boundingClientRect = element[0].getBoundingClientRect();
          return {
            width: boundingClientRect.width || element.prop("offsetWidth"),
            height: boundingClientRect.height || element.prop("offsetHeight"),
            top: elBCR.top - offsetParentBCR.top,
            left: elBCR.left - offsetParentBCR.left
          };
        },
        /*
        	Provides read-only equivalent of jQuery's offset function:
        	http://api.jquery.com/offset/
        */

        offset: function(element) {
          var boundingClientRect;
          boundingClientRect = element[0].getBoundingClientRect();
          return {
            width: boundingClientRect.width || element.prop("offsetWidth"),
            height: boundingClientRect.height || element.prop("offsetHeight"),
            top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
            left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
          };
        },
        /*
        	Provides coordinates for the targetEl in relation to hostEl
        */

        positionElements: function(hostEl, targetEl, positionStr, appendToBody) {
          var hostElPos, pos0, pos1, positionStrParts, shiftHeight, shiftWidth, targetElHeight, targetElPos, targetElWidth;
          positionStrParts = positionStr.split("-");
          pos0 = positionStrParts[0];
          pos1 = positionStrParts[1] || "center";
          hostElPos = void 0;
          targetElWidth = void 0;
          targetElHeight = void 0;
          targetElPos = void 0;
          hostElPos = (appendToBody ? this.offset(hostEl) : this.position(hostEl));
          targetElWidth = targetEl.prop("offsetWidth");
          targetElHeight = targetEl.prop("offsetHeight");
          shiftWidth = {
            center: function() {
              return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
            },
            left: function() {
              return hostElPos.left;
            },
            right: function() {
              return hostElPos.left + hostElPos.width;
            }
          };
          shiftHeight = {
            center: function() {
              return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
            },
            top: function() {
              return hostElPos.top;
            },
            bottom: function() {
              return hostElPos.top + hostElPos.height;
            }
          };
          switch (pos0) {
            case "right":
              targetElPos = {
                top: shiftHeight[pos1](),
                left: shiftWidth[pos0]()
              };
              break;
            case "left":
              targetElPos = {
                top: shiftHeight[pos1](),
                left: hostElPos.left - targetElWidth
              };
              break;
            case "bottom":
              targetElPos = {
                top: shiftHeight[pos0](),
                left: shiftWidth[pos1]()
              };
              break;
            default:
              targetElPos = {
                top: hostElPos.top - targetElHeight,
                left: shiftWidth[pos1]()
              };
          }
          return targetElPos;
        },
        constrainToScreen: function(offset, element, margin) {
          var boundBottom, boundLeft, boundRight, boundTop, elementHeight, elementWidth, windowHeight, windowWidth;
          elementWidth = utils.outerWidth(element[0]);
          elementHeight = utils.outerHeight(element[0]);
          windowHeight = $window.innerHeight;
          windowWidth = $window.innerWidth;
          boundTop = $window.pageYOffset + margin;
          boundLeft = $window.pageXOffset + margin;
          boundRight = boundLeft + windowWidth - elementWidth - margin;
          boundBottom = boundTop + windowHeight - elementHeight - margin;
          return {
            top: utils.clamp(offset.top, boundTop, boundBottom),
            left: utils.clamp(offset.left, boundLeft, boundRight)
          };
        },
        appendToBodyWithoutMoving: function(element) {
          var offset;
          offset = this.offset(element);
          document.body.appendChild(element[0]);
          return element.css({
            position: 'absolute',
            top: offset.top + 'px',
            left: offset.left + 'px',
            height: offset.height + 'px',
            width: offset.width + 'px'
          });
        },
        animateFullsize: function(element, duration) {
          var offset, transform;
          if (duration == null) {
            duration = 500;
          }
          offset = this.offset(element);
          transform = "translate(" + (-offset.left) + "px, " + (-offset.top) + "px)";
          return element.css({
            webkitTransform: transform,
            msTransform: transform,
            MozTransform: transform,
            transform: transform,
            width: '100%',
            height: '100%',
            transition: "all " + (duration / 1000) + "s"
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module("goo.ui.progressBar", []).directive('gooProgressBar', function() {
    return {
      restrict: 'A',
      scope: {
        progress: '=gooProgressBar'
      },
      template: '<div></div>',
      link: function($scope, iElem, iAttr) {
        var div, progress, updateProgress;
        iElem.addClass("progress-bar");
        div = iElem.find('div');
        progress = 0;
        updateProgress = function(p) {
          if (p > progress) {
            progress = p;
            return div.css({
              transition: 'width 0.3s ease',
              opacity: 1,
              width: "" + progress + "%"
            });
          } else if (p === 0) {
            progress = p;
            return div.css({
              transition: 'opacity 0.3s ease, width 0s 0.3s',
              opacity: 0,
              width: 0
            });
          }
        };
        updateProgress(0);
        return $scope.$watch('progress', function(nv, ov) {
          if (nv != null) {
            return updateProgress(nv);
          }
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('goo.ui.propertyEdit', ['goo.ui.checkbox', 'goo.ui.colorInput', 'goo.ui.inputSlider', 'goo.ui.select', 'goo.ui.input']).filter('cutMiddle', function() {
    return function(name, start, end) {
      if (name == null) {
        name = '';
      }
      if (start == null) {
        start = 3;
      }
      if (end == null) {
        end = 3;
      }
      if (name.length < start + end) {
        return name;
      }
      return name.slice(0, start) + '...' + name.slice(-end);
    };
  });

}).call(this);

(function() {
  var module, resizeDirective;

  module = angular.module('goo.ui.resize', []);

  resizeDirective = function(handle, $document, $parse) {
    return {
      link: function($scope, element, attrs) {
        var cssProp, getter, grip, modelExpr, mousemove, mouseup, resizeData, setter;
        resizeData = {};
        modelExpr = attrs['gooResize' + handle.toUpperCase()];
        getter = $parse(modelExpr);
        setter = getter.assign;
        cssProp = handle === 'w' || handle === 'e' ? 'width' : 'height';
        element.addClass("goo-resize goo-resize-" + handle);
        grip = angular.element('<div class="goo-resize-grip"></div>');
        element.append(grip);
        mousemove = function(event) {
          var delta, newDim, snapToZero;
          snapToZero = function(num) {
            if (num < 30) {
              return 0;
            } else {
              return num;
            }
          };
          delta = 0;
          if (cssProp === 'width') {
            if (handle === 'e') {
              delta = event.clientX - resizeData.offset;
            } else {
              delta = resizeData.offset - event.clientX;
            }
          } else {
            if (handle === 's') {
              delta = event.clientY - resizeData.offset;
            } else {
              delta = resizeData.offset - event.clientY;
            }
          }
          newDim = snapToZero(parseInt(resizeData.oldDimension + delta));
          setter($scope, newDim);
          $scope.$broadcast('resize');
          if (!$scope.$$phase) {
            return $scope.$apply();
          }
        };
        mouseup = function() {
          if (!resizeData.isResizing) {
            return;
          }
          resizeData.isResizing = false;
          grip.removeClass('active');
          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);
          $scope.$broadcast('resize-end');
          if (!$scope.$$phase) {
            return $scope.$apply();
          }
        };
        grip.on('mousedown', function(event) {
          event.preventDefault();
          resizeData.isResizing = true;
          if (cssProp === 'width') {
            resizeData.oldDimension = element[0].offsetWidth;
            resizeData.offset = event.clientX;
          } else {
            resizeData.oldDimension = element[0].offsetHeight;
            resizeData.offset = event.clientY;
          }
          grip.addClass('active');
          $document.on('mousemove', mousemove);
          return $document.on('mouseup', mouseup);
        });
        return $scope.$watch(modelExpr, function(newSize, oldSize) {
          return element.css(cssProp, "" + newSize + "px");
        });
      }
    };
  };

  module.directive('gooResizeE', [
    '$document', '$parse', function($document, $parse) {
      return resizeDirective('e', $document, $parse);
    }
  ]);

  module.directive('gooResizeW', [
    '$document', '$parse', function($document, $parse) {
      return resizeDirective('w', $document, $parse);
    }
  ]);

  module.directive('gooResizeN', [
    '$document', '$parse', function($document, $parse) {
      return resizeDirective('n', $document, $parse);
    }
  ]);

  module.directive('gooResizeS', [
    '$document', '$parse', function($document, $parse) {
      return resizeDirective('s', $document, $parse);
    }
  ]);

}).call(this);

(function() {
  angular.module('goo.ui.select', []).directive('gooSelect', [
    '$document', '$timeout', '$interpolate', '$parse', '$compile', function($document, $timeout, $interpolate, $parse, $compile) {
      return {
        restrict: 'A',
        replace: false,
        transclude: true,
        scope: {
          ngModel: "=",
          placeholder: "@",
          gooBlur: "&",
          disabled: "=?"
        },
        compile: function(elem, attrs, transclude) {
          var REGEXP;
          REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+((?:([\$\w][\$\w\d]*)|(?:\(\s*([\$\w][\$\w\d]*)\s*,\s*([\$\w][\$\w\d]*)\s*\)))\s+in\s+(.*))$/;
          return {
            pre: function() {},
            post: function($scope, element, attrs) {
              var $head, $li, $select, $template, close, collection, display, headElement, isOpen, lastSpace, match, model, onClick, onDestroy, onDocumentClicked, open, repeatExpr, toggle, updateLabels, valueName, watchTopLabel, _ref;
              if ($scope.disabed == null) {
                $scope.disabed = false;
              }
              match = (_ref = attrs.ngOptions) != null ? _ref.match(REGEXP) : void 0;
              if (!match) {
                throw Error('wrong expression in ng-options');
              }
              display = match[2] || match[1];
              valueName = match[4] || match[6];
              model = match[2] ? match[1] : valueName;
              repeatExpr = match[3];
              lastSpace = repeatExpr.lastIndexOf(' ') + 1;
              collection = repeatExpr.slice(lastSpace);
              repeatExpr = repeatExpr.slice(0, lastSpace) + '$parent.' + collection;
              $template = angular.element("<div ng-class=\"{disabled: disabled}\">\n	<div class=\"select-header\"></div>\n	<ul>\n		<li	ng-repeat=\"" + repeatExpr + "\"></li>\n	</ul>\n</div>");
              $li = $template.find('li');
              transclude($scope, function(clone) {
                if (clone.length === 0 || /^\s*$/.test(clone.text())) {
                  return $li.html("{{" + display + "}}");
                } else {
                  return $li.append(clone);
                }
              });
              headElement = $template[0].querySelector('div.select-header');
              $head = angular.element(headElement);
              transclude($scope, function(clone) {
                if (clone.length === 0 || /^\s*$/.test(clone.text())) {
                  return $head.html("{{topLabel || placeholder || 'Please select'}}");
                } else {
                  return $head.append(clone);
                }
              });
              $template = $compile($template, transclude);
              $select = $template($scope);
              element.append($select);
              watchTopLabel = null;
              updateLabels = function(currentModel) {
                /*
                            Updates the labels of the select component according to the
                            current value of the model.
                */

                var childScope, currentValue, placeholder, _ref1;
                if (typeof watchTopLabel === "function") {
                  watchTopLabel();
                }
                childScope = $scope.$$childHead;
                $scope.topLabel = null;
                while (childScope) {
                  if (childScope.$eval(model) === currentModel) {
                    watchTopLabel = childScope.$watch(display, function(nv) {
                      return $scope.topLabel = nv;
                    });
                    break;
                  }
                  childScope = childScope.$$nextSibling;
                }
                currentValue = (_ref1 = $scope.$parent.$eval(collection)) != null ? _ref1[currentModel] : void 0;
                placeholder = $scope.placeholder || "Please select";
                return $scope[valueName] = currentValue || currentModel || placeholder;
              };
              isOpen = function() {
                return $select.hasClass('open');
              };
              close = function() {
                return $select.removeClass('open');
              };
              open = function() {
                return $select.addClass('open');
              };
              toggle = function(e) {
                e.stopPropagation();
                if ($scope.disabled || isOpen()) {
                  return close();
                } else {
                  return open();
                }
              };
              onClick = function(e) {
                var currentScope;
                close();
                currentScope = angular.element(e.target).scope();
                $scope.ngModel = currentScope.$eval(model);
                $scope.$apply();
                return $timeout(function() {
                  return typeof $scope.gooBlur === "function" ? $scope.gooBlur() : void 0;
                });
              };
              onDocumentClicked = function(e) {
                /*
                            Called when the user clicks anywhere in the document. If the
                            click is outside of the select component we hide the select
                            options.
                */

                var clickedInside, elm, parent, target;
                target = e.target;
                parent = target.parentNode;
                elm = $select[0];
                clickedInside = target === elm || parent === elm;
                if (isOpen() && !clickedInside) {
                  return close();
                }
              };
              onDestroy = function() {
                /*
                            Makes sure all the event listeners are removed when the
                            component is destroyed.
                */

                element.off('click', onClick);
                $head.off('click', toggle);
                return $document.off('click', onDocumentClicked);
              };
              $scope.$parent.$watchCollection(collection, function() {
                return $scope.$evalAsync(function() {
                  return updateLabels($scope.ngModel);
                });
              }, true);
              $scope.$watch('ngModel', updateLabels);
              $head.on('click', toggle);
              element.on('click', '>div>ul>li', onClick);
              $document.on('click', onDocumentClicked);
              return $scope.$on('$destroy', onDestroy);
            }
          };
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('goo.ui.sortable', ['goo.ui.domUtils']).directive('gooSortable', [
    '$document', 'domUtils', function($document, domUtils) {
      var CHILD_CLASS, DRAGGING_CLASS, OVER_CLASS, SORTABLE_CLASS;
      SORTABLE_CLASS = 'sortable';
      CHILD_CLASS = 'sortable-child';
      DRAGGING_CLASS = 'sortable-dragging';
      OVER_CLASS = 'sortable-over';
      return {
        restrict: 'EA',
        transclude: true,
        link: function($scope, $element, $attr, ngModel, $transclude) {
          var addDragHandlers, buildSortedCollection, collection, delegate, dragEnabled, draggedElement, element, onChange, onCollectionChanged, onDestroy, onDragEnd, onDragEnter, onDragLeave, onDragOver, onDragStart, onDrop, onMouseDown, onMouseUp, onTouchMove, removeDragHandlers, sortBy, sortedCollection, targetElement, updateSortValues, updatingCollectionInternally, warp, _ref;
          element = $element[0];
          collection = $attr.gooSortable;
          sortBy = (_ref = $attr.sortBy) != null ? _ref : 'sortValue';
          if (collection == null) {
            throw new Error('Missing collection (e.g. goo-sortable="collection")');
          }
          sortedCollection = [];
          warp = false;
          draggedElement = null;
          targetElement = null;
          dragEnabled = true;
          updatingCollectionInternally = false;
          delegate = function(fn) {
            /*
            			Returns a new function which applies an event handler with a
            			different depending on the element that was clicked or touched.
            */

            return function(e) {
              var context, supportsTouch, target, touch, xOffset, yOffset, _ref1, _ref2;
              supportsTouch = domUtils.supportsTouch;
              touch = (_ref1 = supportsTouch && e.touches && e.touches[0]) != null ? _ref1 : {};
              target = (_ref2 = touch.target) != null ? _ref2 : e.target;
              if (supportsTouch && document.elementFromPoint) {
                xOffset = e.pageX - document.body.scrollLeft;
                yOffset = e.pageY - document.body.scrollTop;
                target = document.elementFromPoint(xOffset, yOffset);
              }
              if (angular.element(target).hasClass(CHILD_CLASS)) {
                return fn.apply(target, [e]);
              } else if (target !== element) {
                context = domUtils.moveUpToChildNode(element, target);
                if (context) {
                  return fn.apply(context, [e]);
                }
              }
            };
          };
          addDragHandlers = function() {
            /*
            			Adds mouse or touch event handlers depending on whether touch is
            			available in the device or not.
            */

            var endEvent;
            if (domUtils.supportsDragAndDrop) {
              return;
            }
            endEvent = 'mouseup';
            if (domUtils.supportsTouch) {
              endEvent = 'touchEnd';
              $element.on('touchmove', onTouchMove);
            } else {
              $element.on('mouseover', onDragEnter);
              $element.on('mouseout', onDragLeave);
            }
            $element.on(endEvent, onDrop);
            $document.on(endEvent, onDragEnd);
            return $document.on('selectstart', domUtils.prevent);
          };
          removeDragHandlers = function() {
            /*
            			Removes mouse or touch event handlers depending on whether touch is
            			available in the device or not.
            */

            var endEvent;
            if (domUtils.supportsDragAndDrop) {
              return;
            }
            endEvent = 'mouseup';
            if (domUtils.supportsTouch) {
              endEvent = 'touchEnd';
              $element.off('touchmove', onTouchMove);
            } else {
              $element.off('mouseover', onDragEnter);
              $element.off('mouseout', onDragLeave);
            }
            $element.off(endEvent, onDrop);
            $document.off(endEvent, onDragEnd);
            return $document.off('selectstart', domUtils.prevent);
          };
          onDragStart = delegate(function(e) {
            var $el, el, originalEvent, _i, _len, _ref1, _ref2;
            if (!dragEnabled) {
              return;
            }
            if (domUtils.supportsTouch) {
              domUtils.prevent(e);
            }
            originalEvent = (_ref1 = e.originalEvent) != null ? _ref1 : e;
            if ((originalEvent != null ? originalEvent.dataTransfer : void 0) != null) {
              originalEvent.dataTransfer.effectAllowed = 'move';
              originalEvent.dataTransfer.setData("text/plain", originalEvent.target.getAttribute('id'));
            }
            draggedElement = this;
            setTimeout(function() {
              return angular.element(draggedElement).addClass(DRAGGING_CLASS);
            }, 0);
            _ref2 = element.childNodes;
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              el = _ref2[_i];
              if (el.nodeType === domUtils.ELEMENT_NODE) {
                $el = angular.element(el);
                $el.removeClass(DRAGGING_CLASS);
                $el.addClass(CHILD_CLASS);
              }
            }
            return addDragHandlers();
          });
          onDragOver = delegate(function(e) {
            if (!dragEnabled) {
              return;
            }
            if (draggedElement == null) {
              return true;
            }
            if (typeof e.preventDefault === "function") {
              e.preventDefault();
            }
            return false;
          });
          onDragEnter = delegate(function(e) {
            var previousCounter;
            if (!dragEnabled) {
              return;
            }
            if (!draggedElement || draggedElement === this) {
              return true;
            }
            previousCounter = domUtils.dragenterData(this);
            domUtils.dragenterData(this, previousCounter + 1);
            if (previousCounter === 0) {
              angular.element(this).addClass(OVER_CLASS);
              if (!warp) {
                domUtils.moveElementNextTo(draggedElement, this);
                onChange(this, draggedElement);
              }
            }
            return false;
          });
          onDragLeave = delegate(function(e) {
            var previousCounter;
            if (!dragEnabled) {
              return;
            }
            previousCounter = domUtils.dragenterData(this);
            domUtils.dragenterData(this, previousCounter - 1);
            if (!domUtils.dragenterData(this)) {
              angular.element(this).removeClass(OVER_CLASS);
              return domUtils.dragenterData(this, false);
            }
          });
          onDrop = delegate(function(e) {
            var thisSibling;
            if (!dragEnabled) {
              return;
            }
            if (e.type === 'drop') {
              if (typeof e.stopPropagation === "function") {
                e.stopPropagation();
              }
              if (typeof e.preventDefault === "function") {
                e.preventDefault();
              }
            }
            if (this === draggedElement) {
              return;
            }
            if (warp) {
              this.parentNode.insertBefore(draggedElement, this);
              thisSibling = draggedElement.nextSibling;
              this.parentNode.insertBefore(this, thisSibling);
            }
            return onChange(this, draggedElement);
          });
          onDragEnd = function(e) {
            var $el, el, _i, _len, _ref1;
            if (!dragEnabled) {
              return;
            }
            draggedElement = null;
            targetElement = null;
            _ref1 = element.childNodes;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              el = _ref1[_i];
              if (el.nodeType !== domUtils.ELEMENT_NODE) {
                continue;
              }
              $el = angular.element(el);
              $el.removeClass(OVER_CLASS);
              $el.removeClass(DRAGGING_CLASS);
              $el.removeClass(CHILD_CLASS);
              domUtils.dragenterData(el, false);
            }
            return removeDragHandlers();
          };
          onTouchMove = delegate(function(e) {
            var el, isCurrent, isTarget, _i, _len, _ref1;
            isCurrent = draggedElement === this;
            isTarget = targetElement === this;
            if (!draggedElement || isCurrent || isTarget) {
              return true;
            }
            _ref1 = element.childNodes;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              el = _ref1[_i];
              angular.element(el).removeClass(OVER_CLASS);
            }
            targetElement = this;
            if (warp) {
              angular.element(this).addClass(OVER_CLASS);
            } else {
              domUtils.moveElementNextTo(draggedElement, this);
            }
            return domUtils.prevent(e);
          });
          buildSortedCollection = function(data) {
            var item, key;
            sortedCollection = [];
            for (key in data) {
              item = data[key];
              sortedCollection.push({
                item: item,
                key: key
              });
            }
            return sortedCollection.sort(function(a, b) {
              return a.item[sortBy] - b.item[sortBy];
            });
          };
          updateSortValues = function() {
            var index, item, _i, _len, _results;
            _results = [];
            for (index = _i = 0, _len = sortedCollection.length; _i < _len; index = ++_i) {
              item = sortedCollection[index];
              _results.push(item.item[sortBy] = index + 1);
            }
            return _results;
          };
          onMouseDown = function(e) {
            var el, _i, _len, _ref1, _results;
            if ($attr.handle == null) {
              return;
            }
            if (!domUtils.isDescendantByQuery($attr.handle, e.target, true)) {
              dragEnabled = false;
              _ref1 = element.childNodes;
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                el = _ref1[_i];
                _results.push(typeof el.setAttribute === "function" ? el.setAttribute('draggable', 'false') : void 0);
              }
              return _results;
            }
          };
          onMouseUp = function(e) {
            var el, _i, _len, _ref1, _results;
            dragEnabled = true;
            _ref1 = element.childNodes;
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              el = _ref1[_i];
              _results.push(typeof el.setAttribute === "function" ? el.setAttribute('draggable', 'true') : void 0);
            }
            return _results;
          };
          onChange = function(targetElement, draggedElement) {
            var draggedItem, draggedItemIndex, finalIndex, nextElm, nextItem, _base, _base1;
            updatingCollectionInternally = true;
            $scope.$emit('sortable-change', targetElement, draggedElement);
            draggedItem = typeof (_base = angular.element(draggedElement)).scope === "function" ? _base.scope()._item : void 0;
            draggedItemIndex = sortedCollection.indexOf(draggedItem);
            sortedCollection.splice(draggedItemIndex, 1);
            nextElm = domUtils.getClosestSimilarSibling(draggedElement);
            finalIndex = sortedCollection.length;
            if (nextElm != null) {
              nextItem = typeof (_base1 = angular.element(nextElm)).scope === "function" ? _base1.scope()._item : void 0;
              finalIndex = sortedCollection.indexOf(nextItem);
            }
            sortedCollection.splice(finalIndex, 0, draggedItem);
            updateSortValues();
            $scope.$apply();
            return updatingCollectionInternally = false;
          };
          onCollectionChanged = function(collection) {
            var $el, childScope, el, item, _base, _i, _j, _len, _len1, _ref1, _results;
            if (updatingCollectionInternally) {
              return;
            }
            _ref1 = element.childNodes;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              el = _ref1[_i];
              $el = angular.element(el);
              if ($el.hasClass('ng-scope')) {
                if (typeof $el.scope === "function") {
                  if (typeof (_base = $el.scope()).$destroy === "function") {
                    _base.$destroy();
                  }
                }
              }
            }
            $element.html('');
            buildSortedCollection(collection);
            _results = [];
            for (_j = 0, _len1 = sortedCollection.length; _j < _len1; _j++) {
              item = sortedCollection[_j];
              childScope = $scope.$new();
              childScope.item = item.item;
              childScope._item = item;
              _results.push($transclude(childScope, function(clonedElements) {
                var _k, _len2, _results1;
                _results1 = [];
                for (_k = 0, _len2 = clonedElements.length; _k < _len2; _k++) {
                  el = clonedElements[_k];
                  if (typeof el.setAttribute === "function") {
                    el.setAttribute('draggable', 'true');
                  }
                  _results1.push($element.append(clonedElements));
                }
                return _results1;
              }));
            }
            return _results;
          };
          onDestroy = function() {
            $element.off('dragstart', onDragStart);
            $element.off('dragenter', onDragEnter);
            $element.off('dragleave', onDragLeave);
            $element.off('drop', onDrop);
            $element.off('dragover', onDragOver);
            $element.off('dragend', onDragEnd);
            $element.off('touchstart', onDragStart);
            $element.off('mousedown', onDragStart);
            $element.off('mousedown', onMouseDown);
            $document.off('mouseup', onMouseUp);
            return removeDragHandlers();
          };
          $element.addClass(SORTABLE_CLASS);
          $scope.$on('$destroy', onDestroy);
          $scope.$watchCollection(collection, onCollectionChanged);
          if (domUtils.supportsDragAndDrop) {
            $element.on('dragstart', onDragStart);
            $element.on('dragenter', onDragEnter);
            $element.on('dragleave', onDragLeave);
            $element.on('drop', onDrop);
            $element.on('dragover', onDragOver);
            $element.on('dragend', onDragEnd);
          } else {
            if (domUtils.supportsTouch) {
              $element.on('touchstart', onDragStart);
            } else {
              $element.on('mousedown', onDragStart);
            }
          }
          $element.on('mousedown', onMouseDown);
          return $document.on('mouseup', onMouseUp);
        }
      };
    }
  ]).directive('gooSortableItem', [
    function() {
      return {
        restrict: 'EA',
        link: function($scope, $element) {
          return $element.attr('draggable', 'true');
        }
      };
    }
  ]);

}).call(this);

/*
Displays a tooltip when the user hovers over the element. The text displayed
inside the tooltip is the value of the goo-tooltip attribute.
*/


(function() {
  var $tooltip, MARGIN, TOOLTIP_DELAY_IN, TOOLTIP_DELAY_OUT, timeoutIn, timeoutOut, tooltip, tooltipDirective;

  timeoutIn = null;

  timeoutOut = null;

  tooltip = null;

  $tooltip = null;

  TOOLTIP_DELAY_IN = 1000;

  TOOLTIP_DELAY_OUT = 60;

  MARGIN = 5;

  tooltipDirective = function(handle, tooltipPositon, Position, $timeout) {
    return {
      restrict: 'A',
      link: function($scope, $element, $attr) {
        var classListener, contentListener, element, hideTooltip, onDestroy, onMouseEnter, onMouseLeave, position, showTooltip, updateClasses;
        contentListener = classListener = null;
        element = $element[0];
        position = function() {
          var availablePosition, availablePositions, finalPosition, pos, prePos, _i, _len;
          finalPosition = null;
          availablePositions = [tooltipPositon, 'top', 'bottom', 'left', 'right'];
          for (_i = 0, _len = availablePositions.length; _i < _len; _i++) {
            availablePosition = availablePositions[_i];
            prePos = Position.positionElements($element, $tooltip, availablePosition, true);
            pos = Position.constrainToScreen(prePos, $tooltip, MARGIN);
            if (prePos.top === pos.top && prePos.left === pos.left) {
              tooltipPositon = availablePosition;
              finalPosition = pos;
              break;
            }
          }
          if (finalPosition == null) {
            prePos = Position.positionElements($element, $tooltip, 'top', true);
            finalPosition = Position.constrainToScreen(prePos, $tooltip, MARGIN);
            tooltipPositon = 'top';
          }
          finalPosition.top += 'px';
          finalPosition.left += 'px';
          $tooltip.css(finalPosition);
          return updateClasses();
        };
        updateClasses = function() {
          $tooltip.removeAttr('class');
          return $tooltip.addClass(['goo-tooltip', tooltipPositon, $attr.tooltipClass].join(' '));
        };
        showTooltip = function() {
          var content, hasContent, _ref;
          content = (_ref = $attr['gooTooltip' + handle]) != null ? _ref : DEFAULT_TOOLTIP;
          hasContent = function() {
            return (content != null) && content !== '';
          };
          if (hasContent()) {
            tooltip.innerHTML = content;
            $timeout(position);
            tooltip.style.opacity = 1;
          } else {
            tooltip.style.opacity = 0;
          }
          contentListener = $attr.$observe('gooTooltip' + handle, function(val) {
            content = val;
            if (hasContent()) {
              tooltip.innerHTML = content;
              $timeout(position);
              return tooltip.style.opacity = 1;
            } else {
              return tooltip.style.opacity = 0;
            }
          });
          return classListener = $attr.$observe('tooltipClass', function() {
            if (hasContent()) {
              return updateClasses();
            }
          });
        };
        hideTooltip = function() {
          tooltip.style.opacity = 0;
          if (typeof contentListener === "function") {
            contentListener();
          }
          return typeof classListener === "function" ? classListener() : void 0;
        };
        onMouseEnter = function() {
          tooltip.style.opacity = 0;
          if (timeoutOut) {
            $timeout.cancel(timeoutOut);
            timeoutOut = null;
            return showTooltip();
          } else {
            if (timeoutIn) {
              $timeout.cancel(timeoutIn);
              timeoutIn = null;
            }
            return timeoutIn = $timeout(function() {
              showTooltip();
              return timeoutIn = null;
            }, TOOLTIP_DELAY_IN);
          }
        };
        onMouseLeave = function() {
          if (timeoutIn) {
            $timeout.cancel(timeoutIn);
            return timeoutIn = null;
          } else {
            hideTooltip();
            return timeoutOut = $timeout(function() {
              return timeoutOut = null;
            }, TOOLTIP_DELAY_OUT);
          }
        };
        onDestroy = function() {
          return tooltip.style.opacity = 0;
        };
        tooltip = document.getElementById('goo-tooltip');
        if (tooltip == null) {
          tooltip = document.createElement('div');
          tooltip.id = 'goo-tooltip';
          tooltip.style.position = 'absolute';
          document.body.appendChild(tooltip);
        }
        $tooltip = angular.element(tooltip);
        $element.on('mouseenter', onMouseEnter);
        $element.on('mouseleave', onMouseLeave);
        return $scope.$on('$destroy', onDestroy);
      }
    };
  };

  angular.module('goo.ui.tooltip', ['goo.ui.position']).directive('gooTooltip', [
    'Position', '$timeout', function(Position, $timeout) {
      return tooltipDirective('', 'top', Position, $timeout);
    }
  ]).directive('gooTooltipN', [
    'Position', '$timeout', function(Position, $timeout) {
      return tooltipDirective('N', 'top', Position, $timeout);
    }
  ]).directive('gooTooltipE', [
    'Position', '$timeout', function(Position, $timeout) {
      return tooltipDirective('E', 'right', Position, $timeout);
    }
  ]).directive('gooTooltipS', [
    'Position', '$timeout', function(Position, $timeout) {
      return tooltipDirective('S', 'bottom', Position, $timeout);
    }
  ]).directive('gooTooltipW', [
    'Position', '$timeout', function(Position, $timeout) {
      return tooltipDirective('W', 'left', Position, $timeout);
    }
  ]);

}).call(this);

(function() {
  angular.module('goo.ui.domUtils', []).factory('domUtils', [
    function() {
      var DOCUMENT_FRAGMENT_NODE, DOCUMENT_NODE, ELEMENT_NODE, dragenterData, getClosestSimilarSibling, isDescendant, isDescendantByQuery, isDirectDescendant, moveElementNextTo, moveUpToChildNode, prevent, supportsDragAndDrop, supportsTouch;
      ELEMENT_NODE = 1;
      DOCUMENT_NODE = 9;
      DOCUMENT_FRAGMENT_NODE = 11;
      supportsTouch = ('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch);
      supportsDragAndDrop = !supportsTouch && (function() {
        var div;
        div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
      })();
      moveUpToChildNode = function(parent, child) {
        var current;
        if (child === parent) {
          return null;
        }
        current = child;
        while (current) {
          if (current.parentNode === parent) {
            return current;
          }
          current = current.parentNode;
          if (!current || !current.ownerDocument || current.nodeType === DOCUMENT_FRAGMENT_NODE) {
            break;
          }
        }
        return null;
      };
      moveElementNextTo = function(element, elementToMoveNextTo) {
        if (isDirectDescendant(element, elementToMoveNextTo)) {
          return elementToMoveNextTo.parentNode.insertBefore(element, elementToMoveNextTo);
        } else {
          return elementToMoveNextTo.parentNode.insertBefore(element, elementToMoveNextTo.nextSibling);
        }
      };
      isDirectDescendant = function(el1, el2) {
        var cur, parent;
        parent = el1.parentNode;
        if (el2.parentNode !== parent) {
          return false;
        }
        cur = el1.previousSibling;
        while (cur && cur.nodeType !== DOCUMENT_NODE) {
          if (cur === el2) {
            return true;
          }
          cur = cur.previousSibling;
        }
        return false;
      };
      isDescendant = function(parent, child, includeParent) {
        var node;
        if (includeParent == null) {
          includeParent = true;
        }
        if (parent === child) {
          return includeParent;
        }
        node = child;
        while (node !== null) {
          if (node === parent) {
            return true;
          }
          if (node.nodeType === DOCUMENT_NODE) {
            return false;
          }
          node = node.parentNode;
        }
        return false;
      };
      isDescendantByQuery = function(selector, child, includeSelf) {
        var el, matches, node, parent, _i, _len;
        if (includeSelf == null) {
          includeSelf = false;
        }
        node = includeSelf ? child : child.parentNode;
        while (node !== null) {
          if (node.nodeType === DOCUMENT_NODE) {
            return false;
          }
          parent = node.parentNode;
          matches = parent.querySelectorAll(selector);
          for (_i = 0, _len = matches.length; _i < _len; _i++) {
            el = matches[_i];
            if (el === node) {
              return true;
            }
          }
          node = node.parentNode;
        }
        return false;
      };
      prevent = function(e) {
        if (typeof e.stopPropagation === "function") {
          e.stopPropagation();
        }
        if (typeof e.preventDefault === "function") {
          e.preventDefault();
        }
        return e.returnValue = false;
      };
      dragenterData = function(element, val) {
        if (arguments.length === 1) {
          return parseInt(element.getAttribute('data-child-dragenter'), 10) || 0;
        } else if (!val) {
          return element.removeAttribute('data-child-dragenter');
        } else {
          return element.setAttribute('data-child-dragenter', Math.max(0, val));
        }
      };
      getClosestSimilarSibling = function(element) {
        var sibling;
        sibling = element.nextSibling;
        while (sibling) {
          if (sibling.nodeType === element.nodeType) {
            return sibling;
          }
          sibling = sibling.nextSibling;
        }
        return null;
      };
      return {
        ELEMENT_NODE: ELEMENT_NODE,
        DOCUMENT_NODE: DOCUMENT_NODE,
        DOCUMENT_FRAGMENT_NODE: DOCUMENT_FRAGMENT_NODE,
        supportsTouch: supportsTouch,
        supportsDragAndDrop: supportsDragAndDrop,
        moveUpToChildNode: moveUpToChildNode,
        moveElementNextTo: moveElementNextTo,
        isDescendant: isDescendant,
        isDescendantByQuery: isDescendantByQuery,
        prevent: prevent,
        dragenterData: dragenterData,
        getClosestSimilarSibling: getClosestSimilarSibling
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('goo.ui.utils', []).factory('utils', [
    '$q', '$timeout', function($q, $timeout) {
      var _getNumberProp;
      _getNumberProp = function(elm, property) {
        return parseInt(window.getComputedStyle(elm, '').getPropertyValue(property).replace('px', ''), 10);
      };
      return {
        clamp: function(val, min, max) {
          if (val < min) {
            return min;
          }
          if (val > max) {
            return max;
          }
          return val;
        },
        round: function(val, decimals) {
          var scale;
          scale = Math.pow(10, decimals);
          return Math.round(val * scale) / scale;
        },
        outerHeight: function(elm) {
          var height;
          height = _getNumberProp(elm, 'height') + _getNumberProp(elm, 'margin-top') + _getNumberProp(elm, 'margin-bottom');
          if (window.getComputedStyle(elm, '').getPropertyValue('box-sizing') === "border-box") {
            height += _getNumberProp(elm, 'padding-top') + _getNumberProp(elm, 'padding-bottom');
          }
          return height;
        },
        outerWidth: function(elm) {
          var width;
          width = _getNumberProp(elm, 'width') + _getNumberProp(elm, 'margin-left') + _getNumberProp(elm, 'margin-right');
          if (window.getComputedStyle(elm, '').getPropertyValue('box-sizing') === "border-box") {
            width += _getNumberProp(elm, 'padding-left') + _getNumberProp(elm, 'padding-right');
          }
          return width;
        },
        whenReady: function(test, delay, timeout) {
          var deferred, testForTruthiness, whenOverdue;
          if (delay == null) {
            delay = 50;
          }
          if (timeout == null) {
            timeout = 15000;
          }
          /*
          		Runs a test function repeatedly until it passes or a timeout is reached.
          
          		{string} test
          			A function to test until
          
          		{number} delay
          			The interval at thich to evaluate the test function
          
          		{number} timeout
          			The interval to wait before abandonning hope the test will pass.
          
          		Returns {$q.defer().promise}
          			A promise which will resolve once the test function returns a truthy
          			value or be rejected if the timout delay is reached before that happens.
          */

          deferred = $q.defer();
          whenOverdue = $timeout(function() {
            return deferred.reject('Exceeded timout limit');
          }, timeout);
          (testForTruthiness = function() {
            if (test()) {
              $timeout.cancel(whenOverdue);
              return deferred.resolve();
            } else {
              return $timeout(testForTruthiness, delay);
            }
          })();
          return deferred.promise;
        }
      };
    }
  ]);

}).call(this);
