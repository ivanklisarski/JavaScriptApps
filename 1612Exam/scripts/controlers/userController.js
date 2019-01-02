;const userController = (function () {

    /** Fn for Post listener on login */
    function login(context) {
        const username = this.params.username;
        const password = this.params.password;

        userModel.login(username, password)
            .then(function (res) {
                userModel.saveSession(res);
                handler.showInfo(`Successfully logged in!`);
                //viewController.allListings(context);
                viewController.renderHomePage(context);
            }).catch((err) => {
            handler.handleError(err);
            $('input[name="username"]').val('');
            $('input[name="password"]').val('');
        });
    }

    /** Fn for Get listener on logout */
    function logout(context) {
        userModel.logout()
            .then(function () {
                sessionStorage.clear();
                handler.showInfo(`Successfully logged out!`);
                viewController.renderHomePage(context);
            })
    }

    /** Fn for Post listener on register */
    function createRegistration(context) {
        if (!validator.isRegFormValid(context.params)) {
            $('input[name="password"]').val('');
            $('input[name="repeatPass"]').val('');
            return;
        }

        const username = this.params.username;
        const password = this.params.password;

        userModel.register(username, password)
            .then(function (response) {
                userModel.saveSession(response);
                handler.showInfo(`You was register successfully!`);

                viewController.renderHomePage(context);
            })
            .catch(userModel.handleError);
    }

    return {
        login,
        logout,
        createRegistration
    }
})();