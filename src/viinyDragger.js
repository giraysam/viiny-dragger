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
			onStop: function (obj, e) {}
		};
		
		scope.extend(scope.options, opt);

		scope.elm = document.querySelectorAll(elm);
		scope.activeElm = null;

		scope.lastMouseX = 0;
		scope.lastMouseY = 0;
		scope.elmX = 0;
		scope.elmY = 0;

		for (i = 0; i < scope.elm.length; i++) {
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
		if (typeof scope.options.onStart === 'function') {
			scope.options.onStart(obj, e);
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
		
		if (typeof scope.options.onMove === 'function') {
			scope.options.onMove(scope.activeElm, e);
		}
		
		scope.activeElm.style.left = (scope.lastMouseX - scope.elmX) + 'px';
		scope.activeElm.style.top = (scope.lastMouseY - scope.elmY) + 'px';
	};

	ViinyDragger.prototype.stop = function (e) {
		
		if (scope.activeElm === null) {
			return;
		}
		
		if (typeof scope.options.onStop === 'function') {
			scope.options.onStop(scope.activeElm, e);
		}
		
		scope.activeElm.style.zIndex = '';
		scope.activeElm = null;
	};

	return ViinyDragger;

}());