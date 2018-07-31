const Tweenmax = require('gsap/TweenMax');

const getRandomNum = (min, max) => {
  return Math.random() * (max - min) + min;
}

export const introAnim = () => {
  const svg = document.getElementById('svgContainer');

  const timeline = new TimelineMax();
  const path = Array.prototype.slice.call(svg.childNodes);
  path.map(el => {
    timeline.to(el, .4, {
      x: getRandomNum(-500, 500),
      y: getRandomNum(-500, 500),
      rotation: getRandomNum(-720,720),
      opacity: 0,
      ease: Power3.easeInOut,
    }, '-=0.39');
  });
  timeline.call(() => {
    document.getElementById('text').classList.remove('fade-out');
  });
}
