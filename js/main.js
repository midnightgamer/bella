gsap.registerPlugin(ScrollTrigger);

const allLinks = gsap.utils.toArray('.portfolio__categories a')
let pageBackground = document.querySelector('.fill-background')
let imageSmallContainer = document.querySelector('.portfolio__image--s')
let imageLargeContainer = document.querySelector('.portfolio__image--l')
let imageSmallContainerInside = document.querySelector('.portfolio__image--s .image_inside')
let imageLargeContainerInside = document.querySelector('.portfolio__image--l .image_inside')


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


function createPortfolioHover(e) {
    const updateBodyColor = (color) => {
        document.documentElement.style.setProperty('--bcg-fill-color', color)
    }

    if (e.type === 'mouseenter') {
        // change image url
        // fade in images
        // all sibling to fade out and white
        // active link white
        // update background

        const {imagelarge, imagesmall, color} = e.target.dataset;
        const allSiblings = allLinks.filter(item => item !== e.target)
        const tl = gsap.timeline()
        tl.set(imageLargeContainerInside, {backgroundImage: `url(${imagelarge})`})
            .set(imageSmallContainerInside, {backgroundImage: `url(${imagesmall})`})
            .to([imageSmallContainer, imageLargeContainer], {autoAlpha: 1})
            .to(allSiblings, {color: '#fff', autoAlpha: 0.2}, 0)
            .to(e.target, {color: '#fff', autoAlpha: 1}, 0)
            .add(updateBodyColor(color), 0)


    } else if (e.type === 'mouseleave') {
        // fade out image
        //  change all links to black
        //  set background back to default
        const tl = gsap.timeline()
        tl.to([imageSmallContainer, imageLargeContainer], {autoAlpha: 0})
            .to(allLinks, {color: '#000', autoAlpha: 1}, 0)
            .add(updateBodyColor('#acb7ab'), 0)
    }

}

function createPortfolioMove(e) {
    const {clientY} = e;
//    Move large image
    gsap.to(imageLargeContainer, {
        duration: 1.2,
        y: -(document.querySelector('.portfolio__categories').clientHeight - clientY) / 6,
        ease: 'Power3.out'
    })
    //Move small Image
    gsap.to(imageSmallContainer, {
        duration: 1.5,
        y: -(document.querySelector('.portfolio__categories').clientHeight - clientY) / 3,
        ease: 'Power3.out'
    })
}

function initPortfolio() {

    allLinks.forEach(link => {
        link.addEventListener('mouseenter', createPortfolioHover)
        link.addEventListener('mouseleave', createPortfolioHover)
        link.addEventListener('mousemove', createPortfolioMove)
    })
}

function initParallax() {
//    Select all section with-parallax class
    gsap.utils.toArray('.with-parallax').forEach(
        section => {
            //    Get image in section
            const image = section.querySelector('img')

            gsap.to(image, {
                yPercent: 20,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    scrub: true,

                }
            })
        }
    )
}

function initPinSteps() {
    ScrollTrigger.create({
        trigger: '.fixed-nav',
        start: 'top center',
        endTrigger: '#stage4',
        end: 'center center',
        pin: true
    })

    const updateBodyColor = (color) => {
        document.documentElement.style.setProperty('--bcg-fill-color', color)
    }


    gsap.utils.toArray('.stage').forEach((stage, index) => {
        const navLinks = gsap.utils.toArray('.fixed-nav li')

        ScrollTrigger.create({
            trigger: stage,
            start: 'top center',
            end: () => `+=${stage.clientHeight}`,
            toggleClass: {
                targets: navLinks[index],
                className: 'is-active'
            },
            onEnter: () => updateBodyColor(stage.dataset.color),
            onEnterBack: () => updateBodyColor(stage.dataset.color)
        })
    })
}

function initScrollTo() {
//find all links
    gsap.utils.toArray('.fixed-nav a').forEach(link => {
        const target = link.getAttribute('href')
        link.addEventListener('click', e => {
            e.preventDefault();
            gsap.to(window, {duration: 1.5, scrollTo: target, ease: 'Power2.out'})
        })
    })
}

function init() {

    initNavigation();
    initHeaderTilt();
    initHoverRevel();
    initPortfolio();
    initParallax()
    initPinSteps();
    initScrollTo()
}

window.addEventListener('load', function () {
    init();
});
