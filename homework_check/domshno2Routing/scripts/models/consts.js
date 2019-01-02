let consts = (() => {
    const minUsernameLength = 3;
    const maxUsernameLength = 13;
    const minPasswordLength = 4;
    const minTeamNameLength = 3;

    return {
        minUsernameLength, maxUsernameLength,
        minPasswordLength, minTeamNameLength
    }
})();