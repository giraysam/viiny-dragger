/*jslint plusplus: true, eqeq: true */
/*globals, console*/
(function (factory) {
	
	window['ViinyDragger'] = factory();
	
})(function () {
	'use strict';

	var self,
		Position,
		positionType,
		PositionDecorator,
		SnapDecorator,
		AxisDecorator,
		ViinyDragger;

	ViinyDragger = function (elm, options) {
		var selector, i, defaultOptions;
		
		self = this;
		self.activeElm = null;
		self.activeElmX = 0;
		self.activeElmY = 0;

		self.lastMouseX = 0;
		self.lastMouseY = 0;

		defaultOptions = {
			snapX: 1,
			snapY: 1,
			axisX: true,
			axisY: true,
			onStart: function(e, obj) { },
			onDrag: function(e, obj) { },
			onStop: function(e, obj) { }
		};
		
		this.options = this.extend(defaultOptions, options);

		if (typeof elm === 'string') {
			selector = document.querySelectorAll(elm);

		} else {
			return elm;
		}

		if (selector.length > 0) {
			for (i = 0; i < selector.length; i++) {
				this[i] = selector[i];
				this[i].options = self.extend(defaultOptions, options);
				this[i].onmousedown = function(e) {
					self.mousedownHandler(e, this);

					return false;
				};
			}

			this.length = selector.length;

			positionType = new Position();
			positionType = new SnapDecorator(positionType);
			positionType = new AxisDecorator(positionType);
		}

		return this;
	};

	/**
	 * Position
	 */
	Position = function () { };

	Position.prototype = {
		getX: function () {
			return (self.lastMouseX - self.activeElmX);
		},
		getY: function () {
			return (self.lastMouseY - self.activeElmY);
		}
	};

	/**
	 * PositionDecorator
	 * @param position
	 */
	PositionDecorator = function (position) {
		this.position = position;
	};

	PositionDecorator.prototype = {
		getX: function () {
			return this.position.getX();
		},
		getY: function () {
			return this.position.getY();
		}
	};

	/**
	 * SnapDecorator
	 * @param Position Class
	 */
	SnapDecorator = function (position) {
		PositionDecorator.call(this, position);
	};

	SnapDecorator.prototype = new PositionDecorator();
	SnapDecorator.prototype.getX = function () {
		var snapX = self.activeElm.options.snapX;

		return (Math.round(
				this.position.getX() / snapX
			) * snapX);
	};

	SnapDecorator.prototype.getY = function () {
		var snapY = self.activeElm.options.snapY;

		return (Math.round(
				this.position.getY() / snapY
			) * snapY);
	};

	/**
	 * AxisDecorator
	 * @param position Class
	 */
	AxisDecorator = function (position) {
		PositionDecorator.call(this, position);
	};

	AxisDecorator.prototype = new PositionDecorator();
	AxisDecorator.prototype.getX = function () {
		var axisX = self.activeElm.options.axisX;

		if (axisX == true) {
			return this.position.getX();
		}

		return null;
	};

	AxisDecorator.prototype.getY = function () {
		var axisY = self.activeElm.options.axisY;

		if (axisY == true) {
			return this.position.getY();
		}

		return null;
	};

	/**
	 * mousedownHandler
	 *
	 * @param obj
	 */
	ViinyDragger.prototype = {
		mousedownHandler: function (e, obj) {
			
			e.preventDefault();
			this.setActiveElement(obj);
			
			if ( typeof obj.options.onStart === 'function') {
				obj.options.onStart(e, obj);
			}
			
			obj.style.zIndex = 99999;

			self.lastMouseX = document.all ? window.event.clientX : e.pageX;
			self.lastMouseY = document.all ? window.event.clientY : e.pageY;

			self.activeElmX = self.lastMouseX - obj.offsetLeft;
			self.activeElmY = self.lastMouseY - obj.offsetTop;

			document.onmousemove = this.mousemoveHandler;
			document.onmouseup = this.mouseupHandler;
		},

		/**
		 * mousemoveHandler
		 * @param event
		 */
		mousemoveHandler: function (e) {
			self.lastMouseX = document.all ? window.event.clientX : e.pageX;
			self.lastMouseY = document.all ? window.event.clientY : e.pageY;

			if (self.activeElm === null)
				return;

			if (positionType.getX() != null) {
				self.activeElm.style.left = positionType.getX() + 'px';
			}

			if (positionType.getY() != null) {
				self.activeElm.style.top = positionType.getY() + 'px';
			}
			
			if ( typeof self.activeElm.options.onDrag === 'function') {
				self.activeElm.options.onDrag(e, self.activeElm);
			}
		},

		/**
		 * mouseupHandler
		 * @param event
		 */
		mouseupHandler: function (e) {
			if (self.activeElm === null)
				return;
				
			if ( typeof self.activeElm.options.onStop === 'function') {
				self.activeElm.options.onStop(e, self.activeElm);
			}

			self.activeElm.style.zIndex = '';
			self.activeElm = null;
		},

		/**
		 * setActiveElement
		 *
		 * @param obj
		 */
		setActiveElement: function (obj) {
			self.activeElm = obj;
		},

		/**
		 * extend
		 * @param arguments
		 */
		extend: function () {

			for(var i=1; i<arguments.length; i++) {
		        for(var key in arguments[i]) {
		            if(arguments[i].hasOwnProperty(key)) {
		                arguments[0][key] = arguments[i][key];
		            }
		        }
			}

		    return arguments[0];
		}
	};

	// ViinyDragger.instance.prototype = ViinyDragger.prototype;
	
	ViinyDragger.instance = function (elm, options) {
		return new ViinyDragger(elm, options);
	};
	
	return ViinyDragger;

});