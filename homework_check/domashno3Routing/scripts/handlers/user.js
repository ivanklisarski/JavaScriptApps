handlers.user = (() => {
    function getLogin(context) {
        if (sessionStorage.getItem("username")) {
            auth.showError("You must logout first!");

            handlers.helpers.redirectToHome(context);
            
            return;
        }

        context.loadPartials({
            header: "templates/common/header.hbs",
            loginForm: "templates/login/loginForm.hbs",
            footer: "templates/common/footer.hbs"
        })
        .then(function () {
            this.partial("templates/login/loginPage.hbs");
        });
    }

    function postLogin(context) {
        const usernae = context.params.username;
        const password = context.params.password;

        auth.showInfo("Logging in...");

        auth.login(usernae, password)
            .then(userInfo => {
                auth.showInfo(`User "${usernae}" successfully logged in!`);
                auth.saveSession(userInfo);

                context.redirect("#/home");
            })
            .catch(auth.handleError);
    }

    function getRegister(context) {
        if (sessionStorage.getItem("username")) {
            auth.showError("You must logout first!");

            handlers.helpers.redirectToHome(context);

            return;
        }

        context.loadPartials({
            header: "templates/common/header.hbs",
            registerForm: "templates/register/registerForm.hbs",
            footer: "templates/common/footer.hbs"
        })
        .then(function () {
            this.partial("templates/register/registerPage.hbs");
        });
    }

    function postRegister(context) {
        const username = context.params.username.trim();
        const password = context.params.password;
        const repeatPassword = context.params.repeatPassword;

        if (!username) {
            auth.showError("Enter username!");

            return;
        }
        
        if (!password || !repeatPassword) {
            auth.showError("Enter password!");

            return;
        }

        if (password !== repeatPassword) {
            auth.showError("Passwords do not match!");

            return;
        }

        auth.showInfo("Registering...");

        auth.register(username, password)
            .then(userInfo => {
                auth.showInfo(`User "${username}" registered successfully!`);

                context.redirect("#/login")
            })
            .catch(auth.handleError);
    }

    function logout(context) {
        auth.logout()
            .then(() => {
                sessionStorage.clear();

                context.redirect("#/home");
            })
            .catch(auth.handleError);
    }

    return {
        getLogin,
        postLogin,
        getRegister,
        postRegister,
        logout
    };
})();