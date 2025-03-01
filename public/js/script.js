document.addEventListener("DOMContentLoaded", function () {
  const sliderContainer = document.querySelector(".slider");
  const indicators = document.querySelectorAll(".index");
  const path = document.querySelector("#link-svg");
  const line1 = document.querySelector(".line-1");
  const line2 = document.querySelector(".line-2");
  const link = document.querySelector(".link");
  const linkWrapper = document.querySelector(".link-wrapper");

  const totalSlides = 5;
  const linkUrls = [
    "https://www.codegrid.com/",
    "https://www.youtube.com/@codegrid/",
    "https://www.instagram.com/codegridweb/",
    "https://x.com/codegridweb/",
    "https://codepen.io/codegrid/",
  ];

  const slideCache = {};

  let currentSlideIndex = 1;
  let isAnimating = false;
  let currentTopValue = 0;

  function preloadSlides() {
    for (let i = 1; i <= totalSlides; i++) {
      const existingSlide = document.querySelector(`#slide-${i}`);
      if (existingSlide) {
        slideCache[i] = existingSlide;
      } else {
        slideCache[i] = createSlide(i);
      }
    }
  }

  window.addEventListener("wheel", (e) => {
    if (isAnimating) return;
    if (e.deltaY > 0) showNextSlide();
    else if (e.deltaY < 0) showPrevSlide();
  });

  const slides = document.querySelectorAll(".slide");
  slides.forEach((slide, idx) => {
    const img = slide.querySelector("img");
    slideCache[idx + 1] = slide;

    if (idx === 0) {
      gsap.set(slide, { zIndex: 1 });
      gsap.set(img, { scale: 1, top: "0" });
    } else {
      gsap.set(slide, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        zIndex: 0,
      });
      gsap.set(img, { scale: 2, top: "4em" });
    }
  });

  preloadSlides();

  function showNextSlide() {
    if (isAnimating) return;

    const currentSlide = document.querySelector(`#slide-${currentSlideIndex}`);
    if (!currentSlide) return;

    currentSlideIndex++;
    if (currentSlideIndex > totalSlides) currentSlideIndex = 1;

    const normalizedIndex = normalizeSlideTitle(currentSlideIndex);

    let nextSlide = slideCache[normalizedIndex];
    if (!nextSlide) {
      nextSlide = createSlide(normalizedIndex);
      slideCache[normalizedIndex] = nextSlide;
    }

    if (!nextSlide.parentElement) {
      sliderContainer.appendChild(nextSlide);
    }

    animateSlideTransition(currentSlide, nextSlide, "down");
  }

  function showPrevSlide() {
    if (isAnimating) return;

    const currentSlide = document.querySelector(`#slide-${currentSlideIndex}`);
    if (!currentSlide) return;

    currentSlideIndex--;
    if (currentSlideIndex < 1) currentSlideIndex = totalSlides;

    const normalizedIndex = normalizeSlideTitle(currentSlideIndex);

    let prevSlide = slideCache[normalizedIndex];
    if (!prevSlide) {
      prevSlide = createSlide(normalizedIndex);
      slideCache[normalizedIndex] = prevSlide;
    }

    if (!prevSlide.parentElement) {
      sliderContainer.insertBefore(prevSlide, currentSlide);
    }

    animateSlideTransition(currentSlide, prevSlide, "up");
  }

  function createSlide(slideNumber) {
    const normalizedNumber = normalizeSlideTitle(slideNumber);
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.id = `slide-${normalizedNumber}`;

    const img = document.createElement("img");
    img.src = getImageSource(normalizedNumber);
    img.alt = "";

    slide.appendChild(img);

    gsap.set(slide, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      zIndex: 0,
    });
    gsap.set(img, { scale: 2, top: "4em" });

    return slide;
  }

  function animateSlideTransition(currentSlide, nextSlide, direction) {
    if (isAnimating || !currentSlide || !nextSlide) {
      console.warn("Animation in progress or invalid slides provided");
      return;
    }

    isAnimating = true;

    const currentImg = currentSlide.querySelector("img");
    const nextImg = nextSlide.querySelector("img");

    if (!currentImg || !nextImg) {
      console.error("Missing image elements in slides");
      isAnimating = false;
      return;
    }

    gsap.set(nextSlide, {
      clipPath:
        direction === "up"
          ? "polygon(0 0, 100% 0, 100% 0, 0 0)"
          : "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
    });
    gsap.set(nextImg, { scale: 2, top: "4em" });
    gsap.set(currentSlide, { zIndex: 1 });
    gsap.set(nextSlide, { zIndex: 2 });

    const nextIndex =
      direction === "up" ? currentSlideIndex - 1 : currentSlideIndex;
    const normalizedIndex = normalizeSlideTitle(nextIndex);

    updateSlideTitle(normalizedIndex);
    updateIndicators(normalizedIndex);
    updateLink(normalizedIndex);

    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(currentSlide, { zIndex: 0 });
        gsap.set(nextSlide, { zIndex: 1 });

        try {
          manageActiveSlidesInDOM();
        } catch (error) {
          console.error("Error managing slides:", error);
        }

        isAnimating = false;
      },
    });

    timeline.add(animateCircle(), 0);
    timeline.add(animateText(), 0);

    timeline
      .to(
        currentImg,
        {
          scale: 2,
          top: "4em",
          duration: 2,
          ease: "power3.inOut",
        },
        0
      )
      .to(
        nextSlide,
        {
          clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
          duration: 2,
          ease: "power4.inOut",
        },
        0
      )
      .to(
        nextImg,
        {
          scale: 1,
          top: "0",
          duration: 2,
          ease: "power3.inOut",
        },
        0
      );
  }

  function updateSlideTitle(index) {
    const displayNumber = index;
    const multiplier = window.innerWidth < 900 ? 42 : 150;
    currentTopValue = -(displayNumber - 1) * multiplier;

    gsap.to(document.querySelector(".postfix"), {
      y: `${currentTopValue}px`,
      duration: 2,
      ease: "power4.inOut",
    });
  }

  function manageActiveSlidesInDOM() {
    const normalizedCurrentIndex = normalizeSlideTitle(currentSlideIndex);
    const prevIndex = normalizeSlideTitle(currentSlideIndex - 1);
    const nextIndex = normalizeSlideTitle(currentSlideIndex + 1);

    const activeIndices = [prevIndex, normalizedCurrentIndex, nextIndex];

    activeIndices.forEach((index) => {
      if (!document.querySelector(`#slide-${index}`)) {
        if (slideCache[index]) {
          sliderContainer.appendChild(slideCache[index]);
        } else {
          const newSlide = createSlide(index);
          slideCache[index] = newSlide;
          sliderContainer.appendChild(newSlide);
        }
      }
    });

    const slidesInDOM = document.querySelectorAll(".slide");
    slidesInDOM.forEach((slide) => {
      const slideId = parseInt(slide.id.split("-")[1]);

      if (!activeIndices.includes(slideId)) {
        slide.remove();
      }
    });
  }

  function normalizeSlideTitle(number) {
    let normalized = number;
    while (normalized <= 0) normalized += totalSlides;
    return ((normalized - 1) % totalSlides) + 1;
  }

  function getImageSource(slideNumber) {
    return `./images/img-${slideNumber}.jpg`;
  }

  function updateIndicators(index) {
    indicators.forEach((indicator) => {
      gsap.to(indicator, {
        scaleX: 0.5,
        duration: 2,
        ease: "power4.inOut",
      });
    });

    gsap.to(indicators[index - 1], {
      scaleX: 1,
      duration: 2,
      ease: "power4.inOut",
    });
  }

  function createNewText() {
    const line1Text = document.createElement("p");
    const line2Text = document.createElement("p");

    line1Text.textContent = "View";
    line2Text.textContent = "Project";

    gsap.set([line1Text, line2Text], {
      y: 30,
    });

    return { line1Text, line2Text };
  }

  function animateText() {
    const tl = gsap.timeline();
    const currentLine1 = line1.querySelector("p");
    const currentLine2 = line2.querySelector("p");
    const { line1Text, line2Text } = createNewText();

    tl.to([currentLine1, currentLine2], {
      y: -30,
      stagger: 0.1,
      delay: 0.25,
      duration: 1,
      ease: "power3.inOut",
      onComplete: () => {
        currentLine1.remove();
        currentLine2.remove();
      },
    });

    line1.appendChild(line1Text);
    line2.appendChild(line2Text);

    tl.to(
      [line1Text, line2Text],
      {
        y: 0,
        stagger: 0.1,
        delay: 0.75,
        duration: 1,
        ease: "power3.inOut",
      },
      "<"
    );

    return tl;
  }

  function updateLink(index) {
    const linkIndex = (index - 1) % linkUrls.length;
    const linkElement = document.querySelector(".link-wrapper a");
    linkElement.href = linkUrls[linkIndex];
  }

  const length = path.getTotalLength();
  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: 0,
    rotation: -90,
    transformOrigin: "center center",
  });

  function animateCircle() {
    const tl = gsap.timeline();

    tl.set(path, {
      strokeDashoffset: 0,
      strokeDasharray: length,
      scale: 1,
    })
      .to(path, {
        strokeDashoffset: -length,
        duration: 1,
        ease: "power2.inOut",
      })
      .set(path, {
        strokeDashoffset: length,
      })
      .to(path, {
        strokeDashoffset: 0,
        duration: 1,
        ease: "power2.inOut",
      });
    return tl;
  }

  let xTo = gsap.quickTo(linkWrapper, "x", { duration: 0.4, ease: "power3" }),
    yTo = gsap.quickTo(linkWrapper, "y", { duration: 0.4, ease: "power3" });

  link.addEventListener("mousemove", (e) => {
    const rect = link.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;

    xTo(relX * 0.5);
    yTo(relY * 0.5);
  });

  link.addEventListener("mouseleave", () => {
    xTo(0);
    yTo(0);
  });

  gsap.set(linkWrapper, {
    x: 0,
    y: 0,
    xPercent: -50,
    yPercent: -50,
  });

  updateLink(1);
});
