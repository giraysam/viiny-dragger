/*jslint plusplus: true */

var ViinyDragger = (function () {
	'use strict';

	var scope;

	function ViinyDragger(elm, opt) {
		var i = 0;
		
		scope = this;
		scope.options = {
			onStart: function (obj, e) {},
			onMove: function (obj, e) {},
			onStop: function (obj, e) {},
            axis: null
		};

		scope.elm = document.querySelectorAll(elm);
		scope.activeElm = null;

		scope.lastMouseX = 0;
		scope.lastMouseY = 0;
		scope.elmX = 0;
		scope.elmY = 0;

		for (i = 0; i < scope.elm.length; i++) {
            scope.extend(scope.elm[i], opt);
			scope.addMouseDownListener(scope.elm[i]);
		}
	}

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
        
        if (scope.activeElm.axis === 'x') {
            scope.activeElm.style.left = (scope.lastMouseX - scope.elmX) + 'px';
            
        } else if (scope.activeElm.axis === 'y') {
            scope.activeElm.style.top = (scope.lastMouseY - scope.elmY) + 'px';
            
        } else {
            scope.activeElm.style.left = (scope.lastMouseX - scope.elmX) + 'px';
            scope.activeElm.style.top = (scope.lastMouseY - scope.elmY) + 'px';
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

	return ViinyDragger;

}());