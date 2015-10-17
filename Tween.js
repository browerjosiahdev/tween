var Tween = function( element, property, easing, from, to, duration ) {
	if (this.checkSupport()) {
		var cssData = Object.create(null);
		
		// If the "from" value is defined, make sure to set the from value to the given property before setting
		// up the transition styles. 
		if (from !== undefined && property !== undefined) {
			cssData[property] = from;
			
			element.css(cssData);
		}
		
		cssData = Object.create(null);
		
		// Setup the css data object with the duration, property, and easing values, then set these as the css
		// data for the given element. 
		if (duration !== undefined && !isNaN(duration)) {
			cssData.transitionDuration       = (duration / 1000) + 's';
			cssData.oTransitionDuration      = (duration / 1000) + 's';
			cssData.msTransitionDuration     = (duration / 1000) + 's';
			cssData.mozTransitionDuration    = (duration / 1000) + 's';
			cssData.webkitTransitionDuration = (duration / 1000) + 's';
		} else {
			throw new Error('Tween: cannot tween element without a defined duration.');
		}
		
		if (property !== undefined) {
			cssData.transitionProperty       = property;
			cssData.oTransitionProperty      = property;
			cssData.msTransitionProperty     = property;
			cssData.mozTransitionProperty    = property;
			cssData.webkitTransitionProperty = property;
		} else {
			throw new Error('Tween: cannot tween element without a defined property.');
		}
		
		if (easing === undefined) {
			easing = 'linear';
		}
		
		cssData.transitionTimingFunction       = easing;
		cssData.oTransitionTimingFunction      = easing;
		cssData.msTransitionTimingFunction     = easing;
		cssData.mozTransitionTimingFunction    = easing;
		cssData.webkitTransitionTimingFunction = easing;
		
		element.css(cssData);
		
		cssData = Object.create(null);
		
		// Set the "to" value for the given property in order to play the transition.
		cssData[property] = to;
		
		element.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', this.transitionComplete);
		element.css(cssData);
	} else if ($ !== undefined) {
		
	} else {
		throw new Error('Tween: CSS3 transitions not supported, and jQuery is not included.');
	}
};

Tween.prototype.transitionComplete = function() {
	alert('transition complete');
};

Tween.prototype.checkSupport = function() {
	// Check to see if the body/document element supports the "transition" style property, with or without
	// the vendor prefix. Return true if supported, or false if not.
    var element  = document.body || document.documentElement,
        style    = element.style,
        property = 'transition';

    if (typeof style[property] === 'string') { 
		return true; 
	}

    var vendors = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
	
    property = property.charAt(0).toUpperCase() + property.substr(1);

    for (var inVendor = 0; inVendor < vendors.length.length; inVendor++) {
        if (typeof style[vendors[inVendor] + property] === 'string') { 
			return true; 
		}
    }

    return false;
};