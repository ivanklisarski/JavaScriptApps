handlers.catalog = (() => {
    function getCatalog(context) {
        handlers.helpers.setBaseContextParams(context);
            
        context.hasNoTeam = !context.hasTeam;
        
        if (!context.loggedIn) {
            auth.showError("Please Login first.");
            
            handlers.helpers.redirectToHome(context);

            return;
        }

        auth.showInfo("Loading catalog...");

        teamsService.loadTeams()
            .then((teams) => {
                context.teams = teams;

                context.loadPartials({
                    header: "templates/common/header.hbs",                        
                    team: "templates/catalog/team.hbs",
                    footer: "templates/common/footer.hbs"
                })
                .then(function () {
                    this.partial("templates/catalog/teamCatalog.hbs");
                });
            })
            .catch(auth.handleError);
    }

    return {
        getCatalog
    };
})();