import { projects } from "/src/const/projects_data.js";

document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".slider");
  const content = document.querySelector(".postfix")
  const indicator = document.querySelector(".slider-indicator")

  /// VIDEOS ///
  projects.forEach((projects, index) => {
    const projectsElement = document.createElement("div");
    projectsElement.className = `slide`;
    projectsElement.id = `slide-${index + 1}`;
    projectsElement.innerHTML = `
    <video width="320" height="240" preload="auto" muted loop playsinline id="videoId-${index + 1}">
    <source src="${projects.webm}" id="sourceVid" type="video/webm">
    <source src="${projects.mp4}" id="sourceVid" type="video/mp4">
    </video>`;
    slider.appendChild(projectsElement);
  });

  /// FORCE LOAD FIRST VIDEO ///
  const video1 = document.querySelector("#slide-1 video");
  video1.load();


  /// FORCE AUTOPLAY & REMOVE CONTROLS ///
  const videoId1 = document.getElementById("videoId-1");
  videoId1.setAttribute("autoplay", "autoplay");

    videoId1.controls = false;
    videoId1.addEventListener('play', function () {
      this.controls = false;
    });
    videoId1.addEventListener('pause', function () {
      this.controls = false;
    });

  /// CONTENT TITLE ///
  projects.forEach((projects, index) => {
    const contentElement = document.createElement("div");
    contentElement.innerHTML = `${projects.title}`;
    content.appendChild(contentElement);
  });

  /// INDICATOR ///
  projects.forEach((projects, index) => {
    const indicatortElement = document.createElement("div");
    indicatortElement.className = "index";
    indicator.appendChild(indicatortElement);
  });

  // ACTIVE INDICATOR ///
  const indicatorActive = indicator.querySelector("div");
  indicatorActive.classList.add("active");

  /// SLIDER ///
  const indicator_index = document.querySelectorAll(".index");
  const line1 = document.querySelector(".line-1");
  const line2 = document.querySelector(".line-2");
  const path = document.querySelector("svg path");
  const link = document.querySelector(".link");
  const linkWrapper = document.querySelector(".link-wrapper");
 
  /// PATHS ///
  let linkUrls = [];
  let webmPath = []
  let mp4Path = []
  let webpPath = []
  let totalSlides = 0;
    function collectLinks() {
      projects.forEach((projects, index) => {
        linkUrls[index] = projects.link;
        webmPath[index] = projects.webm;
        mp4Path[index] = projects.mp4;
        webpPath[index] = projects.webp;
        totalSlides += 1;
      });
    }

  collectLinks();

  let currentSlideIndex = 1;
  let isAnimating = false;
  let currentTopValue = 0;
  let debounceTimeout;

/// SCROLL ///
  window.addEventListener("wheel", (e) => {
  if (isAnimating) return;
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
     if (e.deltaY > 0) showNextSlide();
     else if (e.deltaY < 0) showPrevSlide();
    }, 60);
  });

/// MOBILE DRAG ///
let touchStartY = 0;
window.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
});

window.addEventListener("touchmove", (e) => {
  if (isAnimating) return;
  let touchEndY = e.touches[0].clientY;
  let deltaY = touchStartY - touchEndY;
  if (Math.abs(deltaY) > 30) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      if (deltaY > 0) showNextSlide();
      else showPrevSlide();
    }, 60);
  }
});

  /// PREPARE SLIDES CLIPPTAH ///
  const slides = document.querySelectorAll(".slide");
  slides.forEach((slide, idx) => {
    const img = slide.querySelector("video");
    if (idx === 0) {
      gsap.set(slide, { zIndex:1 });
      gsap.set(img, { scale: 1.05, top: "0" });
    } else {
      gsap.set(slide, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        zIndex: 0,
      });
      gsap.set(img, { scale: 1.25, top: "4em" });
    }
  });

  /// NEXT SLIDE ///
  function showNextSlide() {
    const currentSlide = document.querySelector(`#slide-${currentSlideIndex}`);

    currentSlideIndex++;
    if (currentSlideIndex > totalSlides) currentSlideIndex = 1; 

    let nextSlide = document.querySelector(`#slide-${currentSlideIndex}`);
    if (!nextSlide) {
      nextSlide = createSlide(currentSlideIndex);
      slider.appendChild(nextSlide);
    }
    /// AUTPLAY ///
    if(LowPowerMode != true) {
      const nextVideo = document.getElementById(`videoId-${currentSlideIndex}`);
      let fixedPrevIndex = currentSlideIndex - 1;
      if(fixedPrevIndex == 0) fixedPrevIndex = totalSlides;
      const prevVideo = document.getElementById(`videoId-${fixedPrevIndex}`);
      nextVideo.setAttribute("autoplay", "autoplay");
      nextVideo.play();
      /// ANIMATION ///
      animateSlideTransition(currentSlide, nextSlide, "down");
  
      /// STOP PREV ///
      if(LowPowerMode != true) {
        prevVideo.removeAttribute("autoplay");
        setTimeout(function() {
          prevVideo.pause();
        }, 1000);
      }
      } else {
      /// LOW BATERY MODE ///
      animateSlideTransition(currentSlide, nextSlide, "down");
      }
  }

  /// PREV SLIDE ///
  function showPrevSlide() {
    const currentSlide = document.querySelector(`#slide-${currentSlideIndex}`);
    let prevSlideIndex = currentSlideIndex - 1;
    if (prevSlideIndex <= 0) prevSlideIndex = totalSlides; 
    let prevSlide = document.querySelector(`#slide-${prevSlideIndex}`);
    if (!prevSlide) {
      prevSlide = createSlide(prevSlideIndex);
      slider.insertBefore(prevSlide, currentSlide);
    }

    /// AUTPLAY ///
    if(LowPowerMode != true) {
    const currentVideo = document.getElementById(`videoId-${currentSlideIndex}`);
    let fixedPrevIndex = currentSlideIndex - 1;
    if (currentSlideIndex -1 == 0) fixedPrevIndex = totalSlides; 
    const prevVideo = document.getElementById(`videoId-${fixedPrevIndex}`);
    prevVideo.setAttribute("autoplay", "autoplay");
    prevVideo.play();

    /// ANIMATION ///
    animateSlideTransition(currentSlide, prevSlide, "up");
    currentSlideIndex--;
    if (currentSlideIndex <= 0) currentSlideIndex = totalSlides; 

    /// STOP PREV ///
    if(LowPowerMode != true) {
      currentVideo.removeAttribute("autoplay");
      setTimeout(function() {
        currentVideo.pause();
      }, 1000);
    }
    } else {
    /// LOW BATERY MODE ///
    animateSlideTransition(currentSlide, prevSlide, "up");
    currentSlideIndex--;
    if (currentSlideIndex <= 0) currentSlideIndex = totalSlides; 
    }
  }

  /// SOURCE NEW SLIDES ///
  function getWebmSource(slideNumber) {return `${webmPath[slideNumber -1]}`}
  function getMp4Source(slideNumber) {return `${mp4Path[slideNumber -1]}`}
  function getWebpSource(slideNumber) {return `${webpPath[slideNumber -1]}`}

  function createSlide(slideNumber) {
    const slide = document.createElement("div");
    slide.className = "slide"
    slide.id = `slide-${slideNumber}`;
    if(LowPowerMode != true) {
    /// VIDEO ///
    const video = document.createElement("video");
    video.setAttribute("width", "1920");
    video.setAttribute("height", "1080");
    video.setAttribute("id", `videoId-${slideNumber}`);
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    video.loop = true;
    slide.appendChild(video)
    /// WEBM ///
      const source_video_webm = document.createElement("source");
      source_video_webm.src = getWebmSource(slideNumber);
      source_video_webm.setAttribute("type", "video/webm");
      source_video_webm.alt = "";
      video.appendChild(source_video_webm);
    /// MP4 ///
      const source_video_mp4 = document.createElement("source");
      source_video_mp4.src = getMp4Source(slideNumber);
      source_video_mp4.setAttribute("type", "video/mp4");
      source_video_mp4.alt = "";
      video.appendChild(source_video_mp4);
      /// SET CLIPPATH ///
      gsap.set(slide, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        zIndex:0
      });
      gsap.set(video, { scale: 1.25, top: "4em" });
      return slide;
    } else {
      /// WEBP ///
      const img = document.createElement("img");
      img.src = getWebpSource(slideNumber);
      img.alt = "Video no disponible";
      slide.appendChild(img);
      /// SET CLIPPATH ///
      gsap.set(slide, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        zIndex:0
      });
      gsap.set(img, { scale: 1.25, top: "4em" });
      return slide;
    }
  }

  function animateSlideTransition(currentSlide, nextSlide, direction) {
    if (isAnimating) return;
    isAnimating = true;

    /// VIDEO ANIMATE ///
    if(LowPowerMode != true) {
      const currentImg = currentSlide.querySelector("video");
      const nextImg = nextSlide.querySelector("video");

      gsap.set(nextSlide, {
        clipPath: direction === "up"
        ? "polygon(0 0 , 100% 0, 100% 0, 0 0)"
        : "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      });
  
      gsap.set(nextImg, {scale: 1.25, top: "4em" });
      gsap.set(currentSlide, { zIndex: 1 });
      gsap.set(nextSlide, { zIndex: 2 });
  
      updateSlideTitle(direction === "up" ? currentSlideIndex - 1 : currentSlideIndex);
      updateIndicators(direction === "up" ? currentSlideIndex - 1 : currentSlideIndex);
      updateLink(direction === "up" ? currentSlideIndex - 1 : currentSlideIndex)
  
      const timeline = gsap.timeline({
        onComplete: () => {
          gsap.set(currentSlide, { zIndex: 0 });
          gsap.set(nextSlide, {zIndex: 1 });
          cleanupSlides();
          isAnimating = false;
        },
      });
      timeline.add(animateCircle(), 0);
      timeline.add(animateText(), 0);
      timeline.to(currentImg, { scale: 1.25, top: "4em", duration: 1.25, ease: "power3.inOut" }, 0)
      .to(nextSlide, {clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", duration: 1.25, ease: "power4.inOut",},0)
      .to(nextImg, { scale: 1.05, top: "0", duration: 1.25, ease: "power3.inOut"}, 0.25);

      /// IMAGE ANIMATE ///
    } else {
      const currentImg = currentSlide.querySelector("img");
      const nextImg = nextSlide.querySelector("img");

      gsap.set(nextSlide, {
        clipPath: direction === "up"
        ? "polygon(0 0 , 100% 0, 100% 0, 0 0)"
        : "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      });
  
      gsap.set(nextImg, {scale: 1.25, top: "4em" });
      gsap.set(currentSlide, { zIndex: 1 });
      gsap.set(nextSlide, { zIndex: 2 });
  
      updateSlideTitle(direction === "up" ? currentSlideIndex - 1 : currentSlideIndex);
      updateIndicators(direction === "up" ? currentSlideIndex - 1 : currentSlideIndex);
      updateLink(direction === "up" ? currentSlideIndex - 1 : currentSlideIndex)
  
      const timeline = gsap.timeline({
        onComplete: () => {
          gsap.set(currentSlide, { zIndex: 0 });
          gsap.set(nextSlide, {zIndex: 1 });
          cleanupSlides();
          isAnimating = false;
        },
      });
      timeline.add(animateCircle(), 0);
      timeline.add(animateText(), 0);
      timeline.to(currentImg, { scale: 1.25, top: "4em", duration: 1.25, ease: "power3.inOut" }, 0)
      .to(nextSlide, {clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", duration: 1.25, ease: "power4.inOut",},0)
      .to(nextImg, { scale: 1.05, top: "0", duration: 1.25, ease: "power3.inOut"}, 0.25);
    }
  }

  function updateSlideTitle(index) {
    const displayTitle = normalizeSlideTitle(index);
    const multiplier = window.innerWidth < 900 ? 42 : 150;
    currentTopValue = -(displayTitle - 1) * multiplier;
    gsap.to(document.querySelector(".postfix"), { y: `${currentTopValue}px`, duration: 1.5, ease: "power4.inOut", });
  }

  /// REMOVE SLIDES >< 2 FROM ACTIVE ///
  function cleanupSlides() {
    const slides = document.querySelectorAll(".slide");
    slides.forEach((slide) => {
      const slideNumber = parseInt(slide.id.split("-")[1]);
      if (Math.abs(slideNumber - currentSlideIndex) > 2) {
        slide.remove();
      }
    });
  }

  function normalizeSlideTitle(number) {
    let normalized = number;
    while (normalized <= 0) normalized += totalSlides;
    return((normalized - 1) % totalSlides) + 1;
  }

  function updateIndicators(index) {
    const normalizedIndex = normalizeSlideTitle(index);
    indicator_index.forEach((indicator_index) => {
    gsap.to(indicator_index, { scaleX: 0.5, duration: 2, ease: "power4.inOut",});
  });

  gsap.to(indicator_index[normalizedIndex - 1], {
    scaleX: 2, duration: 2, ease: "power4.inOut",
  });
  }

  function createNewText() {
    const line1Text = document.createElement("p");
    const line2Text = document.createElement("p");
    line1Text.textContent = "View";
    line2Text.textContent = "Project";

    gsap.set([line1Text, line2Text], { y: 30, });
    return {line1Text, line2Text };
  }

  function animateText() {
    const tl = gsap.timeline();
    const currentLine1 = line1.querySelector("p");
    const currentLine2 = line2.querySelector("p");
    const {line1Text, line2Text} = createNewText();

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

    tl.to([line1Text, line2Text], {
      y: 0,
      stagger: 0.1,
      delay: 0.75,
      duration: 1,
      ease: "power3.inOut",
    }, "<" );
    return tl;
  }

  function updateLink(index) {
    const normalizedIndex = normalizeSlideTitle(index) - 1 ;
    const linkElement = document.querySelector(".link-wrapper a");
    linkElement.href = linkUrls[normalizedIndex]
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
    tl.set(path, { strokeDashoffset: 0, strokeDasharray: length, scale: 1,})
      .to(path, { strokeDashoffset: -length, duration: 1, ease: "power2.inOut",})

      .set(path, { strokeDashoffset: length })
      .to(path, {strokeDashoffset: 0, duration: 1, ease: "power2.inOut"});
      return tl;
  }

  let xTo = gsap.quickTo(linkWrapper, "x", { duration: 0.2, ease: "power2" }),
  yTo = gsap.quickTo(linkWrapper, "y", { duration: 0.2, ease: "power2" });

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

  gsap.set(linkWrapper, {x: 0, y: 0, xPercent: -50, yPercent: -50,});

  updateLink(1);
});

let LowPowerMode = false;

let webpPath = []
  function collectWebp() {
    projects.forEach((projects, index) => {
      webpPath[index] = projects.webp;
    });
  }

collectWebp();

/// LOW POWER BATERY VIDEO FOR IMG REPLACE ///
function reemplazarVideosPorImagen() {
  let i = 0; 
  document.querySelectorAll("[id^='videoId-']").forEach(video => {
    // Creamos la imagen de reemplazo
    const img = document.createElement("img");
    img.src = `${webpPath[i]}`; // Ruta de la imagen
    img.width = video.width;
    img.height = video.height;
    img.alt = "Video no disponible";
    
    // Reemplazamos el video por la imagen
    video.parentNode.replaceChild(img, video);
    i++;
  });
  LowPowerMode = true;
}

// Función para comprobar el estado del videoId-1
function video1CheckAutoplay() {
  const video1 = document.getElementById("videoId-1");
  if (!video1) return;

  const initialTime = video1.currentTime;
  setTimeout(() => {
  if (video1.paused || video1.currentTime === initialTime) {
    reemplazarVideosPorImagen();
    // video1.removeAttribute("autoplay")
    }
  }, 1500);
}

window.addEventListener('load', () => {
  const video1 = document.getElementById("videoId-1");
  if (video1) {
    video1.addEventListener("canplay", () => {
      video1CheckAutoplay();
    });
    // En caso de que el evento 'canplay' ya haya ocurrido, forzamos la comprobación
    if (video1.readyState >= 3) {
      video1CheckAutoplay();
    }
  }

});