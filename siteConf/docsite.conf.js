const SiteConfig = {

    title: 'Markdown DocSite',
    favicon: 'img/favicon.png',
    logo: 'img/favicon.png',
    organizationName: 'Franzininho',

    docs : {
        provider : "GitlabService",
        auth: "GitlabAuth",
        baseUrl: "https://gitlab.com",
        homePage: "https://gitlab.com/vip51/roteiros/publico/-/blob/feature-testes/README.md"
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