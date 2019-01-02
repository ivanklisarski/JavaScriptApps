$(() => {
    const app = Sammy('#main', function () {
        this.use("Handlebars", "hbs");
        
        this.get("#/home", handlers.common.getHome);

        this.get("#/about", handlers.common.getAbout);

        this.get("#/login", handlers.user.getLogin);
        
        this.post("#/login", handlers.user.postLogin);

        this.get("#/register", handlers.user.getRegister);

        this.post("#/register", handlers.user.postRegister);
        
        this.get("#/logout", handlers.user.logout);

        this.get("#/catalog", handlers.catalog.getCatalog);

        //this.get(/\#\/catalog\/:{1,}(.+)/, handlers.teams.getTeam);
        this.get("#/catalog/::teamId", handlers.teams.getTeam);

        this.get(/\#\/join\/:{1,}(.+)/, handlers.teams.join);

        this.get("#/leave", handlers.teams.leave);

        this.get("#/create", handlers.teams.getCreate);

        this.post("#/create", handlers.teams.postCreate);

        this.get("#/edit/::teamId", handlers.teams.getEdit);
        
        this.post("#/edit/::teamId", handlers.teams.postEdit);        
    });

    app.run();
});