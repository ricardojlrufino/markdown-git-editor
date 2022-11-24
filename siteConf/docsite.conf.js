const SiteConfig = {

    title: 'Markdown DocSite',
    favicon: 'img/favicon.png',
    logo: 'img/favicon.png',
    organizationName: 'Franzininho',

    docs : {
        homePage: "https://gitlab.com/vip51/roteiros/publico/-/blob/feature-testes/README.md"
    },

    auth : {
        enabled : "true",
        provider : "GitlabService",
        baseUrl: "https://gitlab.com",
        clientID: "b0d95164b7e362e4ff736ee33fa7e720cbd6b2c63ab650f7afea8b0ed5e4300e",
        secret: "7ad6fe262288c9aea0695eec466fefe4136593bc0aaf02f9657d26daee62fc8c"
    },

    sideBar : {
        resource : "/siteConf/sideBar.json"
    },

    theme: {
        customCss: 'custom.css',
    },    
    
};

export default SiteConfig;

window.DocSiteConfig = SiteConfig;

window.localStorage.setItem("site-config", JSON.stringify(SiteConfig));