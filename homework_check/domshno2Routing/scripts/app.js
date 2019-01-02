$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/home', function (ctx) {
            auth.fillHeaderWithLoginData(ctx);
            this.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs'
            }).then(function (ctx) {
                this.partial('templates/home/home.hbs');
            });
        });

        this.get('#/login', function (ctx) {
            if (auth.isUserLoggedIn()) {
                this.redirect('#/home');
                return;
            }

            auth.fillHeaderWithLoginData(ctx);
            this.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
                loginForm: 'templates/login/loginForm.hbs'
            }).then(function (context) {
                this.partial('templates/login/loginPage.hbs');
            });
        });

        this.get('#/register', function (ctx) {
            auth.fillHeaderWithLoginData(ctx);
            this.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
                registerForm: 'templates/register/registerForm.hbs'
            }).then(function (context) {
                this.partial('templates/register/registerPage.hbs');
            });
        });

        this.get('#/about', function (ctx) {
            auth.fillHeaderWithLoginData(ctx);
            this.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
            }).then(function (ctx) {
                this.partial('templates/about/about.hbs');
            });
        });

        this.get('#/logout', function (ctx) {
            if (!auth.isUserLoggedIn()) {
                this.redirect('#/home');
                return;
            }

            auth.logout()
                .then(function (result) {
                    sessionStorage.clear();
                    ctx.redirect('#/login');
                })
                .catch(function (error) {
                    auth.handleError(error);
                });
        });

        this.get('#/catalog', function (ctx) {
            if (!auth.isUserLoggedIn()) {
                ctx.redirect('#/login');
                return;
            }

            let sammyContext;
            auth.fillHeaderWithLoginData(ctx);
            this.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
                team: 'templates/catalog/team.hbs'
            }).then(function (context) {
                sammyContext = this;
                teamsService.loadTeams()
                    .then(function (teams) {
                        ctx.teams = teams;
                        ctx.hasNoTeam = !auth.isUserHasTeam();
                        sammyContext.partial('templates/catalog/teamCatalog.hbs');
                    })
                    .catch(function (error) {
                        auth.handleError(error);
                    });
            });
        });

        this.get('#/create', function (ctx) {
            if (!auth.isUserLoggedIn()) {
                ctx.redirect('#/login');
                return;
            }

            if (auth.isUserHasTeam()) {
                ctx.redirect('#/catalog');
                return;
            }

            auth.fillHeaderWithLoginData(ctx);
            this.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
                createForm: 'templates/create/createForm.hbs'
            }).then(function (context) {
                this.partial('templates/create/createPage.hbs');
            });
        });

        this.get('#/catalog/:teamId', function (ctx) {
            if (!auth.isUserLoggedIn()) {
                ctx.redirect('#/login');
                return;
            }

            let sammyContext;
            auth.fillHeaderWithLoginData(ctx);
            this.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
                teamMember: 'templates/catalog/teamMember.hbs',
                teamControls: 'templates/catalog/teamControls.hbs'
            }).then(function (context) {
                sammyContext = this;
                let teamId = ctx.params['teamId'];
                teamsService.loadTeamDetails(teamId)
                    .then(function (team) {
                        ctx.name = team['name'];
                        ctx.comment = team['comment'];
                        ctx.isAuthor = auth.isUserCreatorOfTeam(team);
                        ctx.teamId = teamId;
                        sammyContext.partial('templates/catalog/details.hbs');
                    })
                    .catch(function (error) {
                        auth.showError(error);
                    });
            });
        });

        this.get('#/edit/:teamId', function (ctx) {
            if (!auth.isUserLoggedIn()) {
                ctx.redirect('#/login');
                return;
            }

            auth.fillHeaderWithLoginData(ctx);
            let sammyContext;
            this.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
                editForm: 'templates/edit/editForm.hbs'
            }).then(function (context) {
                sammyContext = this;
                let teamId = ctx.params.teamId;
                teamsService.loadTeamDetails(teamId)
                    .then(function (team) {
                        if (!auth.isUserCreatorOfTeam(team)) {
                            ctx.redirect('#/login');
                            return;
                        }

                        let teamId = team['_id'];
                        let name = team['name'];
                        let comment = team['comment'];
                        ctx.teamId = teamId;
                        ctx.name = name;
                        ctx.comment = comment;
                        sammyContext.partial('templates/edit/editPage.hbs');
                    })
                    .catch(function (error) {
                        auth.handleError(error);
                    });
            });
        });

        this.get('#/leave', function (ctx) {
            if (!auth.isUserLoggedIn()) {
                ctx.redirect('#/login');
                return;
            }

            teamsService.leaveTeam()
                .then(function (result) {
                    sessionStorage.removeItem('teamId');
                    ctx.redirect('#/catalog');
                })
                .catch(function (error) {
                    auth.handleError(error);
                });
        });

        this.get('#/join/:teamId', function (ctx) {
            if (!auth.isUserLoggedIn()) {
                ctx.redirect('#/login');
                return;
            }

            if (auth.isUserHasTeam()) {
                ctx.redirect('#/home');
                return;
            }

            let teamId = ctx.params.teamId;
            teamsService.joinTeam(teamId)
                .then(function (result) {
                    auth.showInfo('Successfully joined to ' + result['name']);
                    sessionStorage.setItem('teamId', teamId);
                    ctx.redirect('#/catalog');
                })
                .catch(function (error) {
                    auth.handleError(error);
                });
        });

        this.post('#/create', function () {
            if (!auth.isUserLoggedIn()) {
                this.redirect('#/login');
                return;
            }

            if (auth.isUserHasTeam()) {
                this.redirect('#/catalog');
                return;
            }

            let teamNameInput = $('#name');
            let teamCommentInput = $('#comment');

            let teamName = teamNameInput.val();
            let teamComment = teamCommentInput.val();

            if (teamName.length < consts.minTeamNameLength) {
                auth.showError(`Team name must be at least: ${consts.minTeamNameLength} symbols!`);
            } else {
                teamsService.createTeam(teamName, teamComment)
                    .then(function (newTeam) {
                        auth.showInfo('Team ' + teamName + ' was successfully created');
                        let teamId = newTeam['_id'];
                        teamsService.joinTeam(teamId)
                            .then(function (result) {
                                sessionStorage.setItem('teamId', teamId);
                            })
                            .catch(function (error) {
                                auth.showError(error);
                            });
                    })
                    .catch(function (error) {
                        auth.showError(error);
                    });
            }
        });

        this.post('#/register', function () {
            let usernameInput = $('#username');
            let passwordInput = $('#password');
            let repeatPasswordInput = $('#repeatPassword');

            let usernameVal = usernameInput.val();
            let passwordVal = passwordInput.val();
            let repeatPasswordVal = repeatPasswordInput.val();

            if (usernameVal.length < consts.minUsernameLength || usernameVal.length > consts.maxUsernameLength) {
                auth.showError(`Username must be between ${consts.minUsernameLength} and ${consts.maxUsernameLength} symbols!`);
            } else if (passwordVal.length < consts.minPasswordLength) {
                auth.showError(`Password must be at least ${consts.minPasswordLength} symbols!`);
            } else if (passwordVal !== repeatPasswordVal) {
                auth.showError(`Password and confirm password dont match!`);
            } else {
                auth.register(usernameVal, passwordVal, repeatPasswordVal)
                    .then((result) => {
                        this.redirect('#/login');
                    })
                    .catch((error) => {
                        auth.handleError(error);
                    });
            }
        });

        this.post('#/login', function () {
            if (auth.isUserLoggedIn()) {
                this.redirect('#/home');
                return;
            }

            let usernameInput = $('#username');
            let passwordInput = $('#password');

            auth.login(usernameInput.val(), passwordInput.val())
                .then((result) => {
                    if (result['username'] === usernameInput.val()) {
                        auth.saveSession(result);
                        this.redirect('#/home');
                    }
                })
                .catch((error) => {
                    auth.handleError(error);
                });
        });

        this.post('#/edit/:teamId', function (ctx) {
            if (!auth.isUserLoggedIn()) {
                ctx.redirect('#/login');
                return;
            }

            let teamId = ctx.params.teamId;
            teamsService.loadTeamDetails(teamId)
                .then(function (team) {
                    if (!auth.isUserCreatorOfTeam(team)) {
                        ctx.redirect('#/login');
                        return;
                    }

                    let newName = $('#name').val();
                    let newComment = $('#comment').val();
                    teamsService.edit(teamId, newName, newComment)
                        .then(function (result) {
                            console.log(result);
                            auth.showInfo('Team successfully edited!');
                        })
                        .catch(function (error) {
                            auth.handleError(error);
                        });
                })
                .catch(function (error) {
                    auth.handleError(error);
                });
        });
    });

    app.run('#/home');
});