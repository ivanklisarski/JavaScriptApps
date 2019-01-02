$(() => {
    const app = Sammy('#main', function () {
        this.use("Handlebars", "hbs");

        //HOME page
        function displayHome(ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('./templates/home/home.hbs')
            });
        }
        this.get("index.html", displayHome);
        this.get("#/home", displayHome);
        //About app page
        this.get("#/about", function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial("./templates/about/about.hbs")
            })
        });

        //REGISTER
        this.get("#/register", function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                registerForm: './templates/register/registerForm.hbs'
            }).then(function () {
                this.partial("./templates/register/registerPage.hbs")
            })
        });
        this.post("#/register", function (context) {
            let username = context.params.username;
            let password = context.params.password;
            let repeatPassword = context.params.repeatPassword;
            if (password !== repeatPassword) {
                auth.showError("PASSWORD DO NOT MATCH!");
            } else {
                auth.register(username, password)
                    .then(function (userInfo) {
                        auth.saveSession(userInfo);
                        auth.showInfo("SUCCESS REGISTERED!");
                        context.redirect("#/home");
                    }).catch(auth.handleError);
            }
        });

        //LOGIN
        this.get("#/login", function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                loginForm: './templates/login/loginForm.hbs'
            }).then(function () {
                this.partial("./templates/login/loginPage.hbs")
            })
        });
        this.post("#/login", function (ctx) {
            let username = ctx.params.username;
            let password = ctx.params.password;
            auth.login(username, password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo("LOGGED IN!");
                    ctx.redirect("#/home");
                }).catch(auth.handleError)
        });
        this.get("#/logout", function (ctx) {
            auth.logout().then(function () {
                sessionStorage.clear();
                auth.showInfo("LOGGED OUT!");
                ctx.redirect("#/home");
            })
        });

        //Read All TEAM catalog
        this.get("#/catalog", displayCatalog);

        //Create TEAM
        this.get("#/create", function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                createForm: './templates/create/createForm.hbs'
            }).then(function () {
                this.partial('./templates/create/createPage.hbs')
            })
        });
        this.post("#/create", function (ctx) {
            let teamName = ctx.params.name;
            let teamComment = ctx.params.comment;
            teamsService.createTeam(teamName, teamComment)
                .then(function (teamInfo) {
                    teamsService.joinTeam(teamInfo._id).then(function (userInfo) {
                        auth.saveSession(userInfo);
                        auth.showInfo(`TEAM ${teamName} CREATED!`);
                        ctx.redirect("#/catalog");
                    }).catch(auth.handleError);
                }).catch(auth.handleError);


        });
        function displayCatalog(ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            teamsService.loadTeams().then(function (teams) {
                ctx.hasNoTeam = sessionStorage.getItem("teamId") === null
                    || sessionStorage.getItem("teamId") === "undefined";
                ctx.teams = teams;
                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    team: "./templates/catalog/team.hbs"
                }).then(function () {
                    this.partial("./templates/catalog/teamCatalog.hbs")
                })
            });
        }
        //DETAILS about one chosen TEAM
        this.get("#/catalog/:id", function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            let teamId = ctx.params.id.substr(1);
            teamsService.loadTeamDetails(teamId)
                .then(function (teamInfo) {
                    ctx.teamId = teamId;
                    ctx.name = teamInfo.name;
                    ctx.comment = teamInfo.comment;
                    ctx.isAuthor = teamInfo._acl.creator === sessionStorage.getItem("userId");
                    ctx.isOnTeam = teamInfo._id === sessionStorage.getItem("teamId");
                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        teamControls: "./templates/catalog/teamControls.hbs",
                        // teamMember: "./templates/catalog/teamMember.hbs",
                    }).then(function () {
                        this.partial("./templates/catalog/details.hbs")
                    })
                }).catch(auth.handleError);
        });
        //Join TEAM by id
        this.get("#/join/:id", function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            let teamId = ctx.params.id.substr(1);
            teamsService.joinTeam(teamId)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo("JOINED TEAM SUCCESS!");
                    ctx.redirect(`#/catalog/:${teamId}`);
                }).catch(auth.handleError);
        });
        //Leave TEAM
        this.get("#/leave", function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            teamsService.leaveTeam()
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo("YOU HAVE LEFT THE TEAM!");
                    ctx.redirect("#/catalog");
                }).catch(auth.handleError);
        });
        //EDIT TEAM
        this.get("#/edit/:id",function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            let teamId = ctx.params.id.substr(1);
            teamsService.loadTeamDetails(teamId)
                .then(function (teamInfo) {
                    ctx.teamId = teamId;
                    ctx.name = teamInfo.name;
                    ctx.comment = teamInfo.comment;
                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        editForm: "./templates/edit/editForm.hbs"
                    }).then(function () {
                        this.partial('./templates/edit/editPage.hbs')
                    })
                }).catch(auth.handleError);
        });
        this.post("#/edit/:id",function (ctx){
            let teamId = ctx.params.id.substr(1);
            let teamName = ctx.params.name;
            let teamComment = ctx.params.comment;
            teamsService.edit(teamId, teamName, teamComment)
                .then(function () {
                    auth.showInfo(`TEAM ${teamName} EDITED!`);
                    ctx.redirect(`#/catalog/:${teamId}`);
                }).catch(auth.handleError);
        });
    });

    app.run();
});