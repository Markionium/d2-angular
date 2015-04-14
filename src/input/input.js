(function () {
    document.addEventListener('focus', function (event) {
        console.log(event.target.parentNode.tagName);
        if (event.target.parentNode.tagName === 'D2-INPUT') {
            event.target.parentNode.classList.add('d2-input-focused');
        }
    }, true);

    document.addEventListener('blur', function (event) {
        if (event.target.parentNode.tagName === 'D2-INPUT') {
            event.target.parentNode.classList.remove('d2-input-focused');
        }
    }, true);

    document.addEventListener('change', function (event) {
        if (event.target.parentNode.tagName === 'D2-INPUT') {
            if (event.target.value) {
                event.target.parentNode.classList.add('d2-input-has-content');
            } else {
                event.target.parentNode.classList.remove('d2-input-has-content');
            }
        }
    }, true);
})();
