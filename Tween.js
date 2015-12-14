// The MIT License (MIT)
//
// Copyright (c) 2015 Josiah James Brower
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
var console;
if (console === undefined) {
	console = {
		'log': function(){},
		'dir': function(){},
		'warn': function(){}
	};
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Class Tween.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var Tween = function( element, property, easing, from, to, duration ) {
	// Keep a handle to the given element.
	this.p_element = element;

	// Get/Set properties.
	this.isPlaying = false;

	// Convert the given element to a jquery element.
	if (element.jquery === undefined) {
		element = $(element);
	}

	var cssData = Object.create(null);

	// If the "from" value is defined, make sure to set the from value to the given property before setting
	// up the transition styles.
	if (from !== undefined && property !== undefined) {
		cssData[property] = from;

		element.css(cssData);
	}

	// Clear the css data object.
	cssData = Object.create(null);

	// Set the "to" value for the given property in order to play the transition.
	cssData[property] = to;

	if (this.checkSupport()) {
		// Setup the css data object with the duration, property, and easing values, then set these as the css
		// data for the given element.
		if (duration !== undefined && !isNaN(duration)) {
			cssData.transitionDuration       = (duration / 1000) + 's';
			cssData.oTransitionDuration      = (duration / 1000) + 's';
			cssData.msTransitionDuration     = (duration / 1000) + 's';
			cssData.mozTransitionDuration    = (duration / 1000) + 's';
			cssData.webkitTransitionDuration = (duration / 1000) + 's';
		} else {
			console.warn('Tween: cannot tween element without a defined duration.');
		}

		if (property !== undefined) {
			cssData.transitionProperty       = property;
			cssData.oTransitionProperty      = property;
			cssData.msTransitionProperty     = property;
			cssData.mozTransitionProperty    = property;
			cssData.webkitTransitionProperty = property;
		} else {
			console.warn('Tween: cannot tween element without a defined property.');
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

		// Flag the tween as playing.
		this.isPlaying = true;

		// Watch for the css3 transition to complete, and set the css data for the element to begin the transition.
		element.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
			this.transitionComplete();
		}.bind(this));
		element.css(cssData);
	} else if ($ !== undefined) {
		// Flag the tween as playing.
		this.isPlaying = true;

		// Use the jQuery animate method to tween the element.
		element.animate(cssData, duration, easing, function() {
			this.transitionComplete();
		}.bind(this));
	} else {
		console.warn('Tween: CSS3 transitions not supported, and jQuery is not included.');
	}
};

Tween.TWEEN_COMPLETE = 'TWEENCOMPLETE';
Tween.DISPATCH_ERROR = 'Not able to dispatch event, please make sure you are including jQuery in your project: %function%';

Tween.prototype.stop = function() {
	if (this.checkSupport()) {
		// If using css3 transitions, set the transition property to none
		// to stop the animation.
		var cssData = Object.create(null);

		cssData.transition       = 'none';
		cssData.oTransition      = 'none';
		cssData.msTransition     = 'none';
		cssData.mozTransition    = 'none';
		cssData.webkitTransition = 'none';

		this.p_element.css(cssData);
	} else {
		// If using jquery, call the "stop" method to stop the animation.
		this.p_element.stop();
	}
};

Tween.prototype.transitionComplete = function() {
	// Flag the tween as not playing.
	this.isPlaying = false;

	// Try to dispatch the jquery event, or warn the user if it doesn't work.
	try {
		$(this).trigger({
			'type': Tween.TWEEN_COMPLETE,
			'tween': this,
			'element': this.p_element
		});
	} catch( error ) {
		console.warn(Tween.DISPATCH_ERROR.replace(/%function%/g, 'Tween.transitionComplete():') + error.message);
	}
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
