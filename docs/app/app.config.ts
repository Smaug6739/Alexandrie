export default defineAppConfig({
  ui: {
    colors: {
      primary: "blue",
      neutral: "slate",
    },
    footer: {
      slots: {
        root: "border-t border-default",
        left: "text-sm text-muted",
      },
    },
  },
  seo: {
    siteName: "Alexandrie Documentation",
  },
  header: {
    title: "Alexandrie",
    to: "/",
    logo: {
      alt: "",
      light: "",
      dark: "",
    },
    search: true,
    colorMode: true,
    links: [
      {
        icon: "i-simple-icons-github",
        to: "https://github.com/Smaug6739/Alexandrie",
        target: "_blank",
        "aria-label": "GitHub",
      },
    ],
  },
  footer: {
    credits: `Alexandrie • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [
      {
        icon: "i-simple-icons-discord",
        to: "https://discord.gg/UPsEg6egPj",
        target: "_blank",
        "aria-label": "Nuxt on Discord",
      },
      {
        icon: "i-simple-icons-github",
        to: "https://github.com/Smaug6739/Alexandrie",
        target: "_blank",
        "aria-label": "Alexandrie on GitHub",
      },
    ],
  },
  toc: {
    title: "On this page",
    bottom: {
      title: "Alexandrie",
      edit: "https://github.com/Smaug6739/Alexandrie/edit/main/docs/content",
      links: [
        {
          icon: "i-lucide-star",
          label: "Star on GitHub",
          to: "https://github.com/Smaug6739/Alexandrie",
          target: "_blank",
        },
        {
          icon: "i-lucide-book-open",
          label: "Join the community",
          to: "https://discord.gg/UPsEg6egPj",
          target: "_blank",
        },
      ],
    },
  },
});
