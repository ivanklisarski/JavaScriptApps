handlers.helpers = (() => {
    function setBaseContextParams(context) {
        const username = sessionStorage.getItem("username");

        context.username = username;
        context.loggedIn = !!username;        
    }

    function redirectToHome(context) {
        context.redirect("#/home");
    }

    return {
        setBaseContextParams,
        redirectToHome
    };
})();