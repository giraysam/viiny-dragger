/*jslint plusplus: true, eqeq: true */
/*globals Document, console*/

var ViinyDragger = (function (window) {
	'use strict';

	var self,
		position,
		positionType,
		positionDecorator,
		snapDecorator;
	
	ViinyDragger = function (elm, options) {
		
		var selector, i, _options;
		
		self = this;
		self.activeElm = null;
		self.activeElmX = 0;
		self.activeElmY = 0;
		
		self.lastMouseX = 0;
		self.lastMouseY = 0;
		
		self.defaultOptions = {
			snapX: 1,
			snapY: 1
		};
		
		if (typeof elm === 'string') {
			selector = document.querySelectorAll(elm);
			
		} else {
			return elm;
		}
		
		if (selector.length > 0) {
			for (i = 0; i < selector.length; i++) {
				this[i] = selector[i];
				_options = self.extend(self.defaultOptions, options);
				this[i].options = _options;
				this[i].onmousedown = function(e) {
					self.mousedownHandler(e, this);
					
					return false;
				};
			}
			
			this.length = selector.length;
			
			positionType = new position();
			positionType = new snapDecorator(positionType);
		}
	};
	
	position = function () { };
	
	position.prototype = {
		getX: function () {
			return (self.lastMouseX - self.activeElmX);
		},
		getY: function () {
			return (self.lastMouseY - self.activeElmY);
		}
	};
	
	/**
	 * positionDecorator
	 * @param position
	 */
	positionDecorator = function (position) {
		this.position = position;
	};
	
	positionDecorator.prototype = {
		getX: function () {
			return this.position.getX();
		},
		getY: function () {
			return this.position.getY();
		}
	};
	
	snapDecorator = function (position) {
		positionDecorator.call(this, position);
	};
	
	snapDecorator.prototype = new positionDecorator();
	snapDecorator.prototype.getX = function () {
		var snapX = self.activeElm.options.snapX;
		
		return (Math.round(
				this.position.getX() / snapX
			) * snapX);
	};
	
	snapDecorator.prototype.getY = function () {
		var snapY = self.activeElm.options.snapY;
		
		return (Math.round(
				this.position.getY() / snapY
			) * snapY);
	};
	
	/**
	 * mousedownHandler
	 * 
	 * @param obj
	 */
	ViinyDragger.prototype = {
		mousedownHandler: function (e, obj) {
			this.setActiveElement(obj);
			
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
				
			self.activeElm.style.left = positionType.getX() + 'px';
			self.activeElm.style.top = positionType.getY() + 'px';
		},
		
		/**
		 * mouseupHandler
		 * @param event
		 */
		mouseupHandler: function (e) {
			if (self.activeElm === null)
				return;
				
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
	
	return ViinyDragger;

}(window));