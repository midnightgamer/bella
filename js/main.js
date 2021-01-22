gsap.registerPlugin(ScrollTrigger);


function initNavigation() {
    const mainNavLinks = gsap.utils.toArray('.main-nav a');
    const reversedMainNavLinks = gsap.utils.toArray('.main-nav a').reverse();
    mainNavLinks.forEach(link => {
        link.addEventListener('mouseleave', e => {
            link.classList.add('animate-out')
            setTimeout(() => {
                link.classList.remove('animate-out')
            }, 300)
        })
    })

    function navAnimation(direction) {
        const scrollingDown = direction === 1;
        const links = scrollingDown ? mainNavLinks : reversedMainNavLinks
        return gsap.to(links, {
            duration: 0.3,
            stagger: 0.05,
            autoAlpha: scrollingDown ? 0 : 1,
            y: scrollingDown ? 20 : 0,
            ease: 'Power4.out'
        })
    }

    ScrollTrigger.create({
        start: 100,
        end: 'bottom bottom-=20',
        toggleClass: {
            targets: 'body',
            className: 'has-scrolled'
        },
        onEnter: ({direction}) => navAnimation(direction),
        onLeaveBack: ({direction}) => navAnimation(direction),
        markers: true
    })
}

function initHeaderTilt() {
    document.querySelector('header').addEventListener('mousemove', moveImages);
}

function moveImages(e) {
    const {offsetX, offsetY, target} = e;
    const {clientWidth, clientHeight} = target;


    //Get 0 0 when mouse is in center
    const xPosition = (offsetX / clientWidth) - 0.5;
    const yPosition = (offsetY / clientHeight) - 0.5;

    const modifier = (index) => index * 1.2 + 0.5;

    const leftImages = gsap.utils.toArray('.hg__left .hg__image')
    const rightImages = gsap.utils.toArray('.hg__right .hg__image')

    //Move left images
    leftImages.forEach((img, index) => {
        gsap.to(img, {
            duration: 1.2,
            x: xPosition * 20 * modifier(index),
            y: yPosition * 30 * modifier(index),
            rotationX: yPosition * 40,
            rotationY: xPosition * 10,
            ease: 'Power3.out'
        })
    })
    rightImages.forEach((img, index) => {
        gsap.to(img, {
            duration: 1.2,
            x: xPosition * 20 * modifier(index + 1),
            y: -yPosition * 30 * modifier(index + 1),
            rotationX: yPosition * 40,
            rotationY: xPosition * 10,
            ease: 'Power3.out'
        })
    })

    gsap.to('.decor__circle', {
        duration: 1.7,
        x: xPosition * 100,
        y: yPosition * 120,
        ease: 'Power4.out'
    })
}


function init() {

    initNavigation();
    initHeaderTilt();

}

window.addEventListener('load', function () {
    init();
});
