interface projects {
    id: string
	webm: string
	mp4: string
    webp: string
	title: string
	tags: string
    alt: string
	link: string
}

export const PROJECTS: projects[] = [
    {
        id: "1",
        webm: "/webm/test.webm",
        mp4: "/mp4/test.mp4",
        webp: "/webp/projects/img-1.webp",
        title: "COMPLEXITY DECAL",
        tags: "eSports / Product Design",
        alt: "Foto del proyecto",
        link: "www.google.com",
      },
      {
        id: "2",
        webm: "/webm/test2.webm",
        mp4: "/mp4/test2.mp4",
        webp: "/webp/projects/img-2.webp",
        title: "COMPLEXITY DECAL",
        tags: "Art Director / Designer",
        alt: "Foto del proyecto",
        link: "www.google2.com",
    
      },
      {
        id: "3",
        webm: "/webm/test.webm",
        mp4: "/mp4/test.mp4",
        webp: "/webp/projects/img-3.webp",
        title: "COMPLEXITY DECAL",
        tags: "3D Animation / FX Production",
        alt: "Foto del proyecto",
        link: "www.google3.com",
      },
      {
        id: "4",
        webm: "/webm/test2.webm",
        mp4: "/mp4/test2.mp4",
        webp: "/webp/projects/img-4.webp",
        title: "COMPLEXITY DECAL",
        tags: "Graphic Design / Brand Identity",
        alt: "Foto del proyecto",
        link: "www.google4.com",
      },
      {
        id: "5",
        webm: "/webm/test.webm",
        mp4: "/mp4/test.mp4",
        webp: "/webp/projects/img-5.webp",
        title: "2023 SHOWREEL",
        tags: "Showreel / Animation",
        alt: "Foto del proyecto",
        link: "www.google5.com",
      }
  ] as const