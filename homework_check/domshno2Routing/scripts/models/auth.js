let auth = (() => {
    function saveSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authtoken', userAuth);
        let userId = userInfo._id;
        sessionStorage.setItem('userId', userId);
        let username = userInfo.username;
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('teamId', userInfo.teamId);
        sessionStorage.setItem('loggedIn', 'true');
    }

    // user/login
    function login(username, password) {
        let userData = {
            username,
            password
        };

        return requester.post('user', 'login', 'basic', userData);
    }

    // user/register
    function register(username, password, repeatPassword) {
        let userData = {
            username,
            password
        };

        return requester.post('user', '', 'basic', userData);
    }

    // user/logout
    function logout() {
        let logoutData = {
            authtoken: sessionStorage.getItem('authtoken')
        };

        return requester.post('user', '_logout', 'kinvey', logoutData);
    }

    function handleError(reason) {
        showError(reason.responseJSON.description);
    }

    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        errorBox.text(message);
        errorBox.show();
        setTimeout(() => errorBox.fadeOut(), 3000);
    }

    function fillHeaderWithLoginData(ctx) {
        ctx.loggedIn = sessionStorage.getItem('loggedIn');
        ctx.username = sessionStorage.getItem('username');
    }

    function isUserLoggedIn() {
        let authToken = sessionStorage.getItem('authtoken');
        return authToken !== undefined && authToken !== null;
    }

    function isUserHasTeam() {
        let teamId = sessionStorage.getItem('teamId');
        return teamId && teamId !== 'undefined';
    }

    function isUserCreatorOfTeam(team) {
        let userIdInSession = sessionStorage.getItem('userId');
        return userIdInSession === team['_acl']['creator'];
    }

    return {
        login,
        register,
        logout,
        saveSession,
        showInfo,
        showError,
        handleError,
        fillHeaderWithLoginData,
        isUserLoggedIn,
        isUserHasTeam,
        isUserCreatorOfTeam
    }
})();