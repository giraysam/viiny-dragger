/*jslint plusplus: true, eqeq: true */
/*globals, console*/

(function (factory) {
    'use strict';
    
    window['ViinyDragger'] = factory();
    
}) (function () {
    
    var isDrag = false;
    
    /**
     * @class Positions
     * @param {Object} options
     */
    function Positions(options) {
        this.options = options;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.elmX = 0;
        this.elmY = 0;
    }
    
    Positions.prototype = {
        getOptions: function () {
            return this.options;
        },
        setLastMouseX: function (valueX) {
            this.lastMouseX = valueX;
        },
        setLastMouseY: function (valueY) {
            this.lastMouseY = valueY;
        },
        setElmX: function (valueX) {
            this.elmX = valueX;
        },
        setElmY: function (valueY) {
            this.elmY = valueY;
        },
        getX: function() {
            return (this.lastMouseX - this.elmX);
        },
        getY: function() {
            return (this.lastMouseY - this.elmY);
        }
    };
    
    /**
	 * @class PositionDecorator
	 * @param {Object} Positions
	 */
	function PositionDecorator(Positions) {
		this.Positions = Positions;
	}
	
	PositionDecorator.prototype = {
	    getOptions: function () {
            return this.Positions.getOptions();
        },
	    setLastMouseX: function (valueX) {
            this.Positions.setLastMouseX(valueX);
        },
        setLastMouseY: function (valueY) {
            this.Positions.setLastMouseY(valueY);
        },
        setElmX: function (valueX) {
            this.Positions.setElmX(valueX);
        },
        setElmY: function (valueY) {
            this.Positions.setElmY(valueY);
        },
		getX: function () {
			return this.Positions.getX();
		},
		getY: function () {
			return this.Positions.getY();
		}
	};
	
	/**
	 * @class SnapDecorator
	 * @param {Object} Positions
	 */
	function SnapDecorator (Positions) {
		PositionDecorator.call(this, Positions);
	}
	
	SnapDecorator.prototype = new PositionDecorator();
	
	SnapDecorator.prototype.getX = function () {
		var snapX = this.Positions.getOptions().snapX;

		return (Math.round(
				this.Positions.getX() / snapX
			) * snapX);
	};

	SnapDecorator.prototype.getY = function () {
		var snapY = this.Positions.getOptions().snapY;

		return (Math.round(
				this.Positions.getY() / snapY
			) * snapY);
	};
	
	/**
	 * @class AxisDecorator
	 * @param {Object} Positions
	 */
	function AxisDecorator (Positions) {
		PositionDecorator.call(this, Positions);
	}

	AxisDecorator.prototype = new PositionDecorator();
	
	AxisDecorator.prototype.getX = function () {
		var axisX = this.Positions.getOptions().axisX;

		if (axisX == true) {
			return this.Positions.getX();
		}

		return null;
	};

	AxisDecorator.prototype.getY = function () {
		var axisY = this.Positions.getOptions().axisY;

		if (axisY == true) {
			return this.Positions.getY();
		}

		return null;
	};
    
    /**
     * @class ViinyDragger.instance
     * @param {HTMLElement} el
     * @param {Object} options
     */
    ViinyDragger.instance = function (el, options) {
        var scope = this;
        
        this.el = el;
        this.options = options;
        
        this.Positions = new Positions(this.options);
        
        // Set SnapDecorator
        if (this.options.snapX != 0 || this.options.snapY != 0) {
        	this.Positions = new SnapDecorator(this.Positions);
        }
        
        // Set AxisDecorator
        if (this.options.axisX == false || this.options.axisY == false) {
        	this.Positions = new AxisDecorator(this.Positions);
        }
        
        this.el.onmousedown = function (e) {
            scope.mousedownHandler(e);
        };
    };
    
    ViinyDragger.instance.prototype = {
        
        mousedownHandler: function (e) {
            var event = document.all ? window.event : e,
                scope = this,
                lastMouseX = document.all ? window.event.clientX : e.pageX,
                lastMouseY = document.all ? window.event.clientY : e.pageY;
                
            if (event.preventDefault) {
                event.preventDefault();
                
            } else { // if browser is ie
                document.onselectstart = function () {
                    return false;
                };
            }
            
            if ( typeof this.options.onStart === 'function') {
				this.options.onStart(event, this.el);
			}
            
            isDrag = true;
            
            this.el.style.zIndex = 99999;
            
            this.Positions.setLastMouseX(lastMouseX);
			this.Positions.setLastMouseY(lastMouseY);
			
			this.Positions.setElmX(lastMouseX - this.el.offsetLeft);
			this.Positions.setElmY(lastMouseY - this.el.offsetTop);
			
			// set mousemove event
			document.onmousemove = function (e) {
			    var event = document.all ? window.event : e;
			    scope.mousemoveHandler(event);
			};
			
			// set mouseup event
			document.onmouseup = function (e) {
			    var event = document.all ? window.event : e;
			    scope.mouseupHandler(event);
			};
		},
		
		/**
		 * mousemoveHandler
		 * @param event
		 */
		mousemoveHandler: function (e) {
		    var lastMouseX = document.all ? window.event.clientX : e.pageX,
		        lastMouseY = document.all ? window.event.clientY : e.pageY;
		    
		    this.Positions.setLastMouseX(lastMouseX);
		    this.Positions.setLastMouseY(lastMouseY);

			if (isDrag === false)
				return;
			
			if (this.Positions.getX() !== null) {
			    this.el.style.left = this.Positions.getX() + 'px';
			}
			
			if (this.Positions.getY() !== null) {
			    this.el.style.top = this.Positions.getY() + 'px';
			}
			
			if ( typeof this.options.onDrag === 'function') {
				this.options.onDrag(e, this.el);
			}
		},
		
		/**
		 * mouseupHandler
		 * @param event
		 */
		mouseupHandler: function (e) {
			if (isDrag === false)
				return;
				
			if ( typeof this.options.onStop === 'function') {
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
	extend = function () {

		for(var i=1; i<arguments.length; i++) {
	        for(var key in arguments[i]) {
	            if(arguments[i].hasOwnProperty(key)) {
	                arguments[0][key] = arguments[i][key];
	            }
	        }
		}

	    return arguments[0];
	};
    
    /**
     * @class ViinyDragger
     * @param {HTMLElement} el
     * @param {Object} options
     */
    function ViinyDragger (el, options) {
    	var defaultOptions = {
			snapX: 0,
			snapY: 0,
			axisX: true,
			axisY: true,
			onStart: function(e, obj) { },
			onDrag: function(e, obj) { },
			onStop: function(e, obj) { }
		};
		
		this.options = extend(defaultOptions, options);

        return new ViinyDragger.instance(el, this.options);
    }
    
    return ViinyDragger;
});