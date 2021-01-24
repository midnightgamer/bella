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
        // markers: true
    })
}

function initHeaderTilt() {
    document.querySelector('header').addEventListener('mousemove', moveImages);
}

function initHoverRevel() {
    const sections = gsap.utils.toArray('.rg__column')


    sections.forEach(section => {

        //Components that need to be animated
        section.imageBlock = section.querySelector('.rg__image')
        section.imageBlockImage = section.querySelector('.rg__image img')
        section.mask = section.querySelector('.rg__image--mask')
        section.text = section.querySelector('.rg__text')
        section.textCopy = section.querySelector('.rg__text--copy')
        section.textMask = section.querySelector('.rg__text--mask')
        section.textp = section.querySelector('.rg__text--mask p')

        //    Reset Initial Position
        gsap.set(section.imageBlock, {yPercent: -101})
        gsap.set(section.mask, {yPercent: 100})

        gsap.set(section.textMask, {yPercent: -101})
        gsap.set(section.textp, {yPercent: 100})

        //    add event listener
        section.addEventListener('mouseenter', createHoverReveal)
        section.addEventListener('mouseleave', createHoverReveal)
    })
}

function createHoverReveal(e) {
    const {mask, imageBlock, text, textp, textCopy, textMask, imageBlockImage} = e.target;
    let tl = gsap.timeline({
        defaults: {
            duration: 0.7,
            ease: 'Power4.out'
        }
    })
    if (e.type === 'mouseenter') {

        tl.to([mask, imageBlock, textp, textMask], {yPercent: 0})
            .from(imageBlockImage, {scale: 1.2, duration: 1.2}, 0)
            .to(text, {y: () => -textHeight(textCopy) / 2}, 0)

    } else if (e.type === 'mouseleave') {

        tl.to([mask, textp], {yPercent: 100})
            .to([imageBlock, textMask], {yPercent: -101}, 0)

            .to(text, {y: 0}, 0)


    }

    return tl;
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

function textHeight(textCopy) {
    return textCopy.clientHeight
}

function init() {

    initNavigation();
    initHeaderTilt();
    initHoverRevel();

}

window.addEventListener('load', function () {
    init();
});
