document.addEventListener("DOMContentLoaded", function () {

  /// SET ACTIVE PAGE ///
  let currentPage = window.location.pathname.split("/").pop() || "index.html";
  const menuLinks = document.querySelectorAll(".overlay-menu .menu-item a");
  menuLinks.forEach(link => {
      const linkPage = link.getAttribute("href").split("/").pop();
      if (linkPage === currentPage) {
          link.closest("p").id = "active";
      }
  });

  let activeItemIndicator = document.querySelector(".menu-item p#active");
  const toggleButton = document.querySelector(".burger");
  let isOpen = false;

  gsap.set(".menu-item p", { x: 5025 });

  const timeline = gsap.timeline({ paused: true });

  timeline.to(".overlay", {
    duration: 1,
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    ease: "power4.inOut",
  });

  timeline.to(
    ".menu-item p",
    {
      duration: 1.5,
      x: 0,
      stagger: 0.3,
      ease: "power4.out",
    },
    "-=1"
  );

  // Se anima la variable CSS "--after-width" del elemento activo
  timeline.to(
    activeItemIndicator,
    {
      duration: 1,
      ease: "power4.out",
      delay: 0.5,
      "--after-width": "100%",
    },
    "<"
  );

  timeline.to(
    ".sub-nav",
    {
      bottom: "-2%",
      opacity: 1,
      duration: 0.5,
      delay: 1,
    },
    "<"
  );

  toggleButton.addEventListener("click", function () {
    if (isOpen) {
      timeline.timeScale(1.5).reverse();
    } else {
      timeline.timeScale(1).play();
    }
    isOpen = !isOpen;
  });

});
