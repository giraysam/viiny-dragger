var ViinyDragger = (function () {
	'use strict';

	var scope;

	function ViinyDragger(elm) {
		var i = 0;
		scope = this;

		scope.elm = document.querySelectorAll(elm);
		scope.activeElm = null;

		scope.lastMouseX = 0;
		scope.lastMouseY = 0;
		scope.elmX = 0;
		scope.elmY = 0;
		scope.isDrag = false;

		for (i = 0; i < scope.elm.length; i++) {
			scope.elm[i].onmousedown = function (e) {
				scope.start(this, e);
				document.onmousemove = scope.move;
				document.onmouseup = scope.stop;
				
				return false;
			};
		}
	}

	ViinyDragger.prototype.start = function (obj, e) {
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

		if (scope.activeElm !== null) {
			scope.activeElm.style.left = (scope.lastMouseX - scope.elmX) + 'px';
			scope.activeElm.style.top = (scope.lastMouseY - scope.elmY) + 'px';
		}
	};

	ViinyDragger.prototype.stop = function (e) {
		scope.activeElm.style.zIndex = '';
		scope.activeElm = null;
	};

	return ViinyDragger;

}());