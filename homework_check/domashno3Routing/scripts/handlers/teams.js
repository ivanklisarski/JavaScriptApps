handlers.teams = (() => {
    function setViewTeamContext(context, team) {
        const teamId = team._id;
        
        context.name = team.name;
        context._id = teamId;
        context.teamId = teamId;
        context.comment = team.comment;
        context.isAuthor = sessionStorage.getItem("userId") === team._acl.creator;
        context.isOnTeam = sessionStorage.getItem("teamId") === teamId;
        context.members = JSON.parse(team.members)
            .reduce((acc, cur) => {
                acc.push({
                    username: cur
                }); 
                
                return acc;
            }, []);
    }
    
    function getTeam(context) {
        //const teamId = context.params.splat[0];
        const teamId = context.params.teamId;
            
        handlers.helpers.setBaseContextParams(context);

        teamsService.loadTeamDetails(teamId)
            .then((team) => {
                setViewTeamContext(context, team);

                context.loadPartials({
                    header: "templates/common/header.hbs",
                    teamMember: "templates/catalog/teamMember.hbs",
                    teamControls: "templates/catalog/teamControls.hbs",
                    footer: "templates/common/footer.hbs"
                })
                .then(function () {
                    this.partial("templates/catalog/details.hbs");
                });
            })
            .catch(auth.handleError);
    }

    function join(context) {
        const teamId = context.params.splat;

        auth.showInfo("Joining team...");

        let p1 = teamsService.loadTeamDetails(teamId);
        let p2 = teamsService.joinTeam(teamId);

        Promise.all([p1, p2])
            .then(([team]) => {
                const members = JSON.parse(team.members);
                
                members.push(sessionStorage.getItem("username"));

                teamsService.edit(teamId, team.name, team.comment, members)
                    .then(() => {
                        sessionStorage.setItem("teamId", teamId);
                    context.redirect(`#/catalog/:${teamId}`);
                    })
                    .catch(auth.handleError);
            })
            .catch(auth.handleError);
    }

    function leave(context) {
        const teamId = sessionStorage.getItem("teamId");

        auth.showInfo("Leaving team...");

        let p1 = teamsService.loadTeamDetails(teamId);
        let p2 = teamsService.leaveTeam();
        
        Promise.all([p1, p2])
            .then(([team]) => {                
                const members = JSON.parse(team.members);

                members.splice(members.indexOf(sessionStorage.getItem("username")), 1);

                teamsService.edit(teamId, team.name, team.comment, members)
                    .then(() => {
                        sessionStorage.setItem("teamId", "undefined");
                        
                        handlers.helpers.redirectToHome(context);
                    })
                    .catch(auth.handleError);
            })
            .catch(auth.handleError);
    }

    function getCreate(context) {
        handlers.helpers.setBaseContextParams(context);

        if (!context.loggedIn) {
            auth.showError("Please Login first.");

            context.redirect("#/login");

            return;
        }

        context.loadPartials({
            header: "templates/common/header.hbs",
            createForm: "templates/create/createForm.hbs",
            footer: "templates/common/footer.hbs"
        })
        .then(function () {
            this.partial("templates/create/createPage.hbs");
        });
    }

    function postCreate(context) {
        const name = context.params.name;
        const comment = context.params.comment;

        auth.showInfo("Creating team...");
        
        teamsService.createTeam(name, comment)
            .then((team) => {
                context.redirect(`#/join/:${team._id}`);
            })
            .catch(auth.handleError);
    }

    function getEdit(context) {
        handlers.helpers.setBaseContextParams(context);
        
        const teamId = context.params.teamId;
        
        context.teamId = teamId;

        teamsService.loadTeamDetails(teamId)
            .then(team => {
                if (team._acl.creator !== sessionStorage.getItem("userId")) {
                    auth.showError("You must be creator of the team to edit it!");

                    context.redirect("#/home");

                    return;
                }

                context.loadPartials({
                    header: "templates/common/header.hbs",
                    editForm: "templates/edit/editForm.hbs",
                    footer: "templates/common/footer.hbs"   
                })
                .then(function () {
                    this.partial("templates/edit/editPage.hbs");

                    setTimeout(() => {
                        $("#name").val(team.name);
                        $("#comment").val(team.comment);    
                    }, 100);
                });
            })
            .catch(auth.handleError);
    }

    function postEdit(context) {
        const teamId = context.params.teamId;
        const name = context.params.name;
        const comment = context.params.comment;

        auth.showInfo("Updating team...");

        teamsService.loadTeamDetails(teamId)
            .then((team) => {
                const members = JSON.parse(team.members);

                teamsService.edit(teamId, name, comment, members)
                    .then(() => {
                        context.redirect(`#/catalog/:${teamId}`);
                    })
                    .catch(auth.handleError);
            })
            .catch(auth.handleError);
    }

    return {
        getTeam,
        join,
        leave,
        getCreate,
        postCreate,
        getEdit,
        postEdit
    };
})();