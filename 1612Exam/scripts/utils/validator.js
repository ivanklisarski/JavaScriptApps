;const validator = (function () {

    // function isValidForm(data) {
    //     if (data.title.trim() === '' || data.title.length > 33) {
    //         handler.showError(`Incorrect title!`);
    //         return false;
    //     } else if (data.description.length < 30 || data.description.length > 450) {
    //         handler.showError(`Incorrect description!`);
    //         return false;
    //     } else if (data.brand.trim().length === 0 || data.brand.trim().length > 11) {
    //         handler.showError(`Incorrect brand length! Should be between 1 and 11 characters!`);
    //         return false;
    //     } else if (data.model.trim().length < 4 || data.model.trim().length > 11) {
    //         handler.showError(`Incorrect model length! Should be between 4 and 11 characters!`);
    //         return false;
    //     } else if (data.year.length !== 4) {
    //         handler.showError(`Incorrect year length! The year must be only 4 chars long!`);
    //         return false;
    //     } else if (!data.imageUrl.startsWith('http')) {
    //         handler.showError(`Incorrect imageUrl! Should start with "http"`);
    //         return false;
    //     } else if (data.fuelType.length < 5 || data.fuelType.length > 11) {
    //         handler.showError(`Incorrect fuelType length! Should be between 5 and 11 characters!`);
    //         return false;
    //     } else if (data.price === '' || data.price < 0 || data.price > 1000000) {
    //         handler.showError(`Incorrect price! Maximum price is 1000000$`);
    //         return false;
    //     }
    //
    //     return true;
    // }

    function isRegFormValid(data) {
        const username = data.username;
        const password = data.password;


        const usernameRegex = /[A-Za-z]{3,}/;
        const passRegex = /[A-Za-z0-9]{6,}/;

        if (!usernameRegex.test(username)) {
            handler.showError(`Incorrect username! Should be at least 3 characters long and should contain only english alphabet letters.`);
            return false;
        } else if (!passRegex.test(password)) {
            handler.showError(`Incorrect password! Should be at least 6 characters long and should contain only english alphabet letters and digits.`);
            return false;
        }

        return true;
    }

    return {

        isRegFormValid
    }
})();