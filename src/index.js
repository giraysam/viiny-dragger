/*jslint plusplus: true, eqeq: true */

var ViinyDragger = (function () {
	'use strict';

	var scope;

	function ViinyDragger(elm, opt) {
		var i = 0;
		
		scope = this;
		scope.defaults = {
			onStart: function (obj, e) {},
			onMove: function (obj, e) {},
			onStop: function (obj, e) {},
			axis: null,
			snapX: 1,
			snapY: 1
		};

		scope.elm = document.querySelectorAll(elm);
		scope.activeElm = null;

		scope.lastMouseX = 0;
		scope.lastMouseY = 0;
		scope.elmX = 0;
		scope.elmY = 0;

		for (i = 0; i < scope.elm.length; i++) {
			scope.extend(scope.elm[i], scope.defaults);
			
			scope.extend(scope.elm[i], scope.checkOptions(opt));
			scope.addMouseDownListener(scope.elm[i]);
		}
	}
	
	ViinyDragger.prototype.checkOptions = function (opt) {
		opt.snapX = (opt.snapX === parseInt(opt.snapX, 10)) ? opt.snapX : 1;
		opt.snapY = (opt.snapY === parseInt(opt.snapY, 10)) ? opt.snapY : 1;
		
		return opt;
	};

	ViinyDragger.prototype.extend = function (opt, props) {
		var prop = null;
		
		for (prop in props) {
			if (props.hasOwnProperty(prop)) {
				opt[prop] = props[prop];
			}
		}
	};

	ViinyDragger.prototype.addMouseDownListener = function (obj) {
		obj.onmousedown = function (e) {
			scope.start(this, e);
			document.onmousemove = scope.move;
			document.onmouseup = scope.stop;
			return false;
		};
	};

	ViinyDragger.prototype.start = function (obj, e) {
		if (typeof obj.onStart === 'function') {
			obj.onStart(obj, e);
		}
		
		scope.activeElm = obj;
		obj.style.zIndex = 9999;

		scope.lastMouseX = document.all ? window.event.clientX : e.pageX;
		scope.lastMouseY = document.all ? window.event.clientY : e.pageY;

		scope.elmX = scope.lastMouseX - obj.offsetLeft;
		scope.elmY = scope.lastMouseY - obj.offsetTop;
	};

	ViinyDragger.prototype.move = function (e) {
		scope.lastMouseX = document.all ? window.event.clientX : e.pageX;
		scope.lastMouseY = document.all ? window.event.clientY : e.pageY;

		if (scope.activeElm === null) {
			return;
		}
		
		if (typeof scope.activeElm.onMove === 'function') {
			scope.activeElm.onMove(scope.activeElm, e);
		}
        
        if (scope.activeElm.axis == 'x') {
			scope.setPosition('x', scope.lastMouseX - scope.elmX);
            
        } else if (scope.activeElm.axis == 'y') {
            scope.setPosition('y', scope.lastMouseY - scope.elmY);
            
        } else {
			scope.setPosition('x', scope.lastMouseX - scope.elmX);
			scope.setPosition('y', scope.lastMouseY - scope.elmY);
        }
	};

	ViinyDragger.prototype.stop = function (e) {
		
		if (scope.activeElm === null) {
			return;
		}
		
		if (typeof scope.activeElm.onStop === 'function') {
			scope.activeElm.onStop(scope.activeElm, e);
		}
		
		scope.activeElm.style.zIndex = '';
		scope.activeElm = null;
	};
	
	ViinyDragger.prototype.setPosition = function (pos, value) {
		
		if (pos == 'x') {
			scope.activeElm.style.left = (Math.round(
				(value) / scope.activeElm.snapX
			) * scope.activeElm.snapX) + 'px';
			
		} else if (pos == 'y') {
			scope.activeElm.style.top = (Math.round(
				(value) / scope.activeElm.snapY
			) * scope.activeElm.snapY) + 'px';
		}
	};

	return ViinyDragger;

}());