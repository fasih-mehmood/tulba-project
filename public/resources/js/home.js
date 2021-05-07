$(document).ready(function () {

    /* For the sticky navigation */
    $('.js-section-about').waypoint(function (direction) {
        if (direction == "down") {
            $('nav').addClass('sticky');
        } else {
            $('nav').removeClass('sticky');
        }
    }, {
        offset: '60px;'
    });
    /* Scroll on buttons */
    $('.js-scroll-to-login').click(function () {
        $('html, body').animate({
            scrollTop: $('.js-section-login').offset().top
        }, 1000);
    });

    $('.js-scroll-to-start').click(function () {
        $('html, body').animate({
            scrollTop: $('.js-section-about').offset().top
        }, 1000);
    });

    /* Navigation scroll */
    // Select all links with hashes
    $('a[href*="#"]')
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000, function () {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        };
                    });
                }
            }
        });

    /* Animations on scroll */
    $('.js-wp-1').waypoint(function (direction) {
        $('.js-wp-1').addClass('animated fadeIn');
    }, {
        offset: '50%'
    });

    $('.js-wp-2').waypoint(function (direction) {
        $('.js-wp-2').addClass('animated fadeInUp');
    }, {
        offset: '60%'
    });

    $('.js-wp-3').waypoint(function (direction) {
        $('.js-wp-3').addClass('animated fadeIn');
    }, {
        offset: '70%'
    });

    $('.js-wp-4').waypoint(function (direction) {
        $('.js-wp-4').addClass('animated pulse');
    }, {
        offset: '50%'
    });

    $('.js-wp-5').waypoint(function (direction) {
        $('.js-wp-5').addClass('animated fadeInUp');
    }, {
        offset: '70%'
    });

    $('.js-wp-6').waypoint(function (direction) {
        $('.js-wp-6').addClass('animated pulse');
    }, {
        offset: '70%'
    });

    $('.js-wp-7').waypoint(function (direction) {
        $('.js-wp-7').addClass('animated fadeInUp');
    }, {
        offset: '70%'
    });

    /* Mobile nav */
    $('.js-nav-icon').click(function () {
        var nav = $('.js-main-nav');
        var icon = $('.js-nav-icon i');

        nav.slideToggle(200);
        if (icon.hasClass('ion-navicon-round')) {
            icon.addClass('ion-close-round');
            icon.removeClass('ion-navicon-round');
        } else {
            icon.removeClass('ion-close-round');
            icon.addClass('ion-navicon-round');
        }
    });

// Toggle Dropdown
$('.profile').click(() => {
    $('.dropdown').slideToggle(200);
})

// Error Popup
function error(message) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        confirmButtonColor: '#000',
        text: message
    });
}

// beta
const betaForm = document.querySelector('#betaForm');
betaForm.addEventListener('submit',(e) => {
    e.preventDefault();
    if(betaForm.checkValidity() == false) {
        error();
        return;
    }
    const email = betaForm['betaEmail'].value;
    db.collection('beta').doc(email).set({
        email: betaForm['betaEmail'].value
    })
    Swal.fire({
        icon: 'success',
        title: 'Success',
        confirmButtonColor: 'greenyellow',
        text: 'You have successfully applied to be a beta tester!'
    });
    betaForm.reset();
})

// login
const loginForm = document.querySelector('#loginForm');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
	// get user info
	const email = loginForm['email'].value;
	const password = loginForm['password'].value;

	// log the user in
	auth.signInWithEmailAndPassword(email, password).then(() => {
        document.body.innerHTML = "";
        Swal.fire({
            icon: 'success',
            title: 'Success',
            confirmButtonColor: 'greenyellow',
            text: 'Logged in successfully!'
        }).then(() => {
            window.location.href = "profile.html"
        });
	}).catch(err => {
        if (err.message.indexOf('There is no user') !== -1) {
            error("The specified email doesn't exist. Please register and then login.");
        } else if (err.message.indexOf('password') !== -1) {
            error("The password is incorrect.");
        } else {
            error(err.message);
        }
    });
});

// contact
const contactForm = document.querySelector('#contactForm');
contactForm.addEventListener('submit',(e) => {
    e.preventDefault();
    if(contactForm.checkValidity() == false) {
        error();
        return;
    }
    const email = contactForm['contactEmail'].value;
    db.collection('messages').doc(email).set({
        name: contactForm['contactName'].value,
        email: contactForm['contactEmail'].value,
        findUs: contactForm['findUs'].value,
        message: contactForm['message'].value
    })
    Swal.fire({
        icon: 'success',
        title: 'Success',
        confirmButtonColor: 'greenyellow',
        text: 'Your response has been recorded!'
    });
    contactForm.reset();
    })

});
