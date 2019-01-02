handlers.common = (() => {
    function getHome(context) {
        handlers.helpers.setBaseContextParams(context);

        const teamId = sessionStorage.getItem("teamId");
        
        context.teamId = teamId;
        context.hasTeam = !!teamId && teamId !== "undefined";
        
        context.loadPartials({
            header: "templates/common/header.hbs",
            footer: "templates/common/footer.hbs"
        })
        .then(function () {
            this.partial("templates/home/home.hbs");
        });
    }

    function getAbout(context) {
        handlers.helpers.setBaseContextParams(context);

        context.loadPartials({
            header: "templates/common/header.hbs",
            footer: "templates/common/footer.hbs"
        })
        .then(function () {
            this.partial("templates/about/about.hbs");
        });
    }

    return {
        getHome,
        getAbout,
    };
})();