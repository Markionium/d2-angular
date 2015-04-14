import angular from 'angular';

function rippleEffectAnimation(animation) {
    return rippleEffect;

    function rippleEffect(event) {
        var size;
        var rippleEffectDiv = document.createElement('span');
        rippleEffectDiv.classList.add('ripple-effect-container');

        this.appendChild(rippleEffectDiv);

        size = parseInt(window.getComputedStyle(rippleEffectDiv).width, 10);

        rippleEffectDiv.style.left = ((window.pageXOffset + event.clientX) - this.offsetLeft - size / 2) + 'px';
        rippleEffectDiv.style.top = ((window.pageYOffset + event.clientY) - this.offsetTop) - size / 2 + 'px';
        rippleEffectDiv.classList.add('ripple-animate');

        //Remove ripple event
        rippleEffectDiv.addEventListener(animation.events.end, function () {
            rippleEffectDiv.parentNode.removeChild(rippleEffectDiv);
        });
    }
}

export default rippleEffectAnimation;
