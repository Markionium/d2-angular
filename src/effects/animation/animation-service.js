import angular from 'angular';
import effects from '../effects';

let isFunction = angular.isFunction;

/**
 * @service animation
 *
 * @description
 * Css animation service that is used by directives with animations.
 */
class Animation {
    constructor() {
        /**
         * @property events
         *
         * @description
         * Will contain an object with the names of the event types relating to css3 animations.
         *
         * For the default css events it would be set to the following.
         * ```json
         * {
         *      start: 'animationstart',
         *      iteration: 'animationiteration',
         *      end: 'animationend'
         *  }
         * ```
         */
        this.events = getWhichAnimationEvents();
    }

    /**
     * @method isSupported
     *
     * @returns {boolean} Returns true when animations are supported otherWise False;
     *
     * @description
     * Check if an animation is supported
     */
    isSupported() {
        return !!getWhichAnimationEvents();
    }

    /**
     * @method get
     *
     * @param {string} animationName Name of the animation to get the animationFunction for.
     * @returns {Function} Function to run the animation (this is usually passed to an event handler
     * like `element.on('click', animationFunction);`)
     *
     * @description
     * Returns the animation function that can be used with a eventHandler
     */
    get(animationName) {
        if (this.isSupported() && isFunction(effects[animationName])) {
            return effects[animationName].apply(null, [this]);
        }
        return angular.noop;
    }
}

function getWhichAnimationEvents() {
    var t;
    var el = document.createElement('fakeelement');
    var animations = {
        animation: {
            start: 'animationstart',
            iteration: 'animationiteration',
            end: 'animationend'
        },
        OAnimation: {
            start: 'oanimationstart',
            iteration: 'oanimationiteration',
            end: 'oanimationend'
        },
        MozAnimation: {
            start: 'animationstart',
            iteration: 'animationiteration',
            end: 'animationend'
        },
        WebkitAnimation: {
            start: 'webkitAnimationStart',
            iteration: 'webkitAnimationIteration',
            end: 'webkitAnimationEnd'
        }
    };

    for (t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
}

export default Animation;
