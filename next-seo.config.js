/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: "Mamala",
  titleTemplate: "%s",
  defaultTitle: "Mamala Dance",
  description: "Mamala: The dancing game",
  canonical: "https://mamala.dance",
  openGraph: {
    url: "https://mamala.dance",
    title: "Mamala",
    description: "Mamala: The dancing game",
    images: [
      {
        url: "mamala_team.jpeg",
        alt: "Mamala Team",
      },
    ],
    site_name: "Mamala",
  },
  instagram: {
    handle: "@mamala",
    cardType: "summary_large_image",
  },
};

export default defaultSEOConfig;
