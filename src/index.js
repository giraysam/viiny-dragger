/*jslint plusplus: true, eqeq: true */
/*globals, console*/

(function(factory) {
	'use strict';
	window.viiny = window.viiny || {};

	if (typeof define === "function" && define.amd) {
		define(factory);
	}
	else if (typeof module != "undefined" && typeof module.exports != "undefined") {
		module.exports = factory();
	}
	else {
		window.viiny.dragger = factory();
	}

})(function() {

	var isDrag = false;

	/**
	 * @class Positions
	 * @param {Object} options
	 */
	function Positions(options) {
		this.options = options;
		this.points = {
			elmX: 0,
			elmY: 0,
			firstMouseX: 0,
			firstMouseY: 0,
			lastMouseX: 0,
			lastMouseY: 0
		};
	}

	Positions.prototype = {
		getOptions: function() {
			return this.options;
		},
		setPoints: function(points) {
			if (points.elmX)
				this.points.elmX = points.elmX;

			if (points.elmY)
				this.points.elmY = points.elmY;

			if (points.firstMouseX)
				this.points.firstMouseX = points.firstMouseX;

			if (points.firstMouseY)
				this.points.firstMouseY = points.firstMouseY;

			if (points.lastMouseX)
				this.points.lastMouseX = points.lastMouseX;

			if (points.lastMouseY)
				this.points.lastMouseY = points.lastMouseY;
		},
		getPoints: function() {
			return this.points;
		},
		getDistanceX: function() {
			return Math.abs(this.points.lastMouseX - this.points.firstMouseX);
		},
		getDistanceY: function() {
			return Math.abs(this.points.lastMouseY - this.points.firstMouseY);
		},
		getX: function() {
			return (this.points.lastMouseX - this.points.elmX);
		},
		getY: function() {
			return (this.points.lastMouseY - this.points.elmY);
		}
	};

	/* =========================== Decorators ============================== */
	/**
	 * @class PositionDecorator
	 * @param {Object} Positions
	 */
	function PositionDecorator(Positions) {
		this.Positions = Positions;
	}

	PositionDecorator.prototype = {
		getOptions: function() {
			return this.Positions.getOptions();
		},
		setPoints: function(points) {
			this.Positions.setPoints(points);
		},
		getPoints: function() {
			return this.Positions.getPoints();
		},
		getDistanceX: function() {
			return this.Positions.getDistanceX();
		},
		getDistanceY: function() {
			return this.Positions.getDistanceY();
		},
		getX: function() {
			return this.Positions.getX();
		},
		getY: function() {
			return this.Positions.getY();
		}
	};

	/**
	 * @class SnapDecorator
	 * @param {Object} Positions
	 */
	function SnapDecorator(Positions) {
		PositionDecorator.call(this, Positions);
	}

	SnapDecorator.prototype = new PositionDecorator();

	SnapDecorator.prototype.getX = function() {
		var snapX = this.Positions.getOptions().snapX;

		return (Math.round(
			this.Positions.getX() / snapX
		) * snapX);
	};

	SnapDecorator.prototype.getY = function() {
		var snapY = this.Positions.getOptions().snapY;

		return (Math.round(
			this.Positions.getY() / snapY
		) * snapY);
	};

	/**
	 * @class AxisDecorator
	 * @param {Object} Positions
	 */
	function AxisDecorator(Positions) {
		PositionDecorator.call(this, Positions);
	}

	AxisDecorator.prototype = new PositionDecorator();

	AxisDecorator.prototype.getX = function() {
		var axisX = this.Positions.getOptions().axisX;

		if (axisX == true) {
			return this.Positions.getX();
		}

		return null;
	};

	AxisDecorator.prototype.getY = function() {
		var axisY = this.Positions.getOptions().axisY;

		if (axisY == true) {
			return this.Positions.getY();
		}

		return null;
	};

	/**
	 * @class RestrictionDecorator
	 * @param {Object} Positions
	 */
	function RestrictionDecorator(Positions, el, restrictEl) {
		PositionDecorator.call(this, Positions);

		restrictEl = restrictEl || 'document';
		this.el = el;

		if (restrictEl == 'document') {
			this.restrictWidth = window.innerWidth || document.body.clientWidth;
			this.restrictHeight = window.innerHeight || document.body.clientHeight;
		}
		else {
			if (typeof restrictEl != 'object')
				throw new Error('Restrict must be object: ' +
					'document.getElementById("obj_id")');

			restrictEl.style.position = 'relative';

			this.restrictWidth = restrictEl.offsetWidth;
			this.restrictHeight = restrictEl.offsetHeight;
		}
	}

	RestrictionDecorator.prototype = new PositionDecorator();

	RestrictionDecorator.prototype.getX = function() {
		if (this.Positions.getX() < 0) {
			return 0;
		}
		else if (this.Positions.getX() >
			(this.restrictWidth - this.el.offsetWidth)) {
			return (this.restrictWidth - this.el.offsetWidth);
		}

		return this.Positions.getX();
	};

	RestrictionDecorator.prototype.getY = function() {
		if (this.Positions.getY() < 0) {
			return 0;
		}
		else if (this.Positions.getY() >
			(this.restrictHeight - this.el.offsetHeight)) {
			return (this.restrictHeight - this.el.offsetHeight);
		}

		return this.Positions.getY();
	};

	/* ========================= Decorators End ============================ */

	/**
	 * @class ClassManager
	 */
	function ClassManager() {}

	ClassManager.prototype = {

		addClass: function(elm, className) {
			if (this.hasClass(elm, className)) {
				return true;
			}
			elm.className += ' ' + className;
		},

		hasClass: function(elm, className) {
			var r = new RegExp('(^| )' + className + '( |$)');

			return (elm.className && elm.className.match(r));
		},

		removeClass: function(elm, className) {
			var cls, r;

			cls = elm.className;
			r = new RegExp('(^| )' + className + '( |$)');
			cls = cls.replace(r, '').replace(/ /g, ' ');
			elm.className = cls;
		}
	};

	/**
	 * @class ViinyDragger.instance
	 * @param {HTMLElement} el
	 * @param {Object} options
	 */
	ViinyDragger.instance = function(el, options) {
		var scope = this;

		this.el = el;
		this.options = options;

		this.el.style.position = "absolute";

		this.Positions = new Positions(this.options);
		this.ClassManager = new ClassManager();

		// Set AxisDecorator
		if (this.options.axisX == false || this.options.axisY == false) {
			this.Positions = new AxisDecorator(this.Positions);
		}

		// Set SnapDecorator
		if (this.options.snapX != 1 || this.options.snapY != 1) {
			this.Positions = new SnapDecorator(this.Positions);
		}

		// set RestrictionDecorator
		this.Positions = new RestrictionDecorator(
			this.Positions,
			this.el, this.options.restrict
		);

		this.el.onmousedown = function(e) {
			scope.mousedownHandler(e);
		};

		this.el.ontouchstart = function(e) {
			e.preventDefault();
			scope.mousedownHandler(e.changedTouches[0]);
		};

	};

	ViinyDragger.instance.prototype = {

		mousedownHandler: function(e) {

			var event = document.all ? window.event : e,
				scope = this,
				mouseX = document.all ? window.event.clientX : e.pageX,
				mouseY = document.all ? window.event.clientY : e.pageY;

			if (event.preventDefault) {
				event.preventDefault();

			}
			else { // if browser is ie
				document.onselectstart = function() {
					return false;
				};
			}

			// add activeClass to active object.
			this.ClassManager.addClass(this.el, this.options.activeClass);

			if (typeof this.options.onStart === 'function') {
				this.options.onStart(event, this.el);
			}

			isDrag = true;

			this.el.style.zIndex = 99999;

			this.Positions.setPoints({
				firstMouseX: mouseX,
				firstMouseY: mouseY,
				elmX: (mouseX - this.el.offsetLeft),
				elmY: (mouseY - this.el.offsetTop)
			});

			// set mousemove event
			document.onmousemove = function(e) {
				var event = document.all ? window.event : e;
				scope.mousemoveHandler(event);
			};

			// set touchmove event
			document.ontouchmove = function(e) {
				var event = e.changedTouches[0];
				scope.mousemoveHandler(event);
			};

			// set mouseup event
			document.onmouseup = function(e) {
				var event = document.all ? window.event : e;
				scope.mouseupHandler(event);
			};

			// set touchend event
			document.ontouchend = function(e) {
				var event = e.changedTouches[0];
				scope.mouseupHandler(event);
			};
		},

		/**
		 * mousemoveHandler
		 * @param event
		 */
		mousemoveHandler: function(e) {
			var mouseX = document.all ? window.event.clientX : e.pageX,
				mouseY = document.all ? window.event.clientY : e.pageY;

			this.Positions.setPoints({
				lastMouseX: mouseX,
				lastMouseY: mouseY
			});

			if (isDrag === false)
				return;

			if (this.Positions.getX() !== null) {
				this.el.style.left = this.Positions.getX() + 'px';
			}

			if (this.Positions.getY() !== null) {
				this.el.style.top = this.Positions.getY() + 'px';
			}

			e['distanceX'] = this.Positions.getDistanceX();
			e['distanceY'] = this.Positions.getDistanceY();

			if (typeof this.options.onDrag === 'function') {
				this.options.onDrag(e, this.el);
			}
		},

		/**
		 * mouseupHandler
		 * @param event
		 */
		mouseupHandler: function(e) {
			if (isDrag === false)
				return;

			// remove activeClass
			this.ClassManager.removeClass(this.el, this.options.activeClass);

			e['distanceX'] = this.Positions.getDistanceX();
			e['distanceY'] = this.Positions.getDistanceY();

			if (typeof this.options.onStop === 'function') {
				this.options.onStop(e, this.el);
			}

			this.el.style.zIndex = '';
			isDrag = false;
		}
	};

	/**
	 * extend
	 * @param arguments
	 */
	function extend() {

		for (var i = 1; i < arguments.length; i++) {
			for (var key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key)) {
					arguments[0][key] = arguments[i][key];
				}
			}
		}

		return arguments[0];
	}

	/**
	 * @class ViinyDragger
	 * @param {HTMLElement} el
	 * @param {Object} options
	 */
	function ViinyDragger(el, options) {
		var defaultOptions = {
			activeClass: '',
			snapX: 1,
			snapY: 1,
			axisX: true,
			axisY: true,
			restrict: 'document',
			onStart: function(e, obj) {},
			onDrag: function(e, obj) {},
			onStop: function(e, obj) {}
		};

		this.options = extend(defaultOptions, options);

		return new ViinyDragger.instance(el, this.options);
	}

	return ViinyDragger;
});