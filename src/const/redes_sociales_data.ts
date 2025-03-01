interface RedesSociales {
	id: string
	name: string
  description: string
	url: string
	svg: string
}

export const REDES_SOCIALES: RedesSociales[] = [
    {
      id: "behance",
      name: "Behance",
      description: "Logo de Behance",
      svg: "/svg/behance.svg",
      url: "https://www.behance.net/FourGFX"
    },
    {
      id: "twitter",
      name: "Twitter",
      description: "Logo de X",
      svg: "/svg/x.svg",
      url: "https://twitter.com/FourDesignsGFX"
    },
    {
      id: "instagram",
      name: "Instagram",
      description: "Logo de Instagram",
      svg: "/svg/instagram.svg",
      url: "https://www.instagram.com/FourDesignsGFX"
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      description: "Logo de LinkedIn",
      svg: "/svg/linkedin.svg",
      url: "https://linkedin.com/in/fourgfx/"
    }
  ] as const