$(() => {
    const app = Sammy('#container', function () {
        /** Load plugins */
        this.use('Handlebars', 'hbs');

        /** add listeners */
         this.get('/index.html', viewController.renderHomePage);
         this.get('#/home', viewController.renderHomePage);
        //
         this.get('#/login', viewController.renderLoginPage);
         this.post('#/login', userController.login);
         this.get('#/logout', userController.logout);
        //
         this.get('#/register', viewController.renderRegisterPage);
         this.post('#/register', userController.createRegistration);
        //
         this.get('#/allListings', viewController.allListings);
        // this.get('#/details/:_id', viewController.details);
         this.get('#/myListings', viewController.myListings);
        //
         this.get('#/create', viewController.renderCreatePage);
         this.post('#/create', listingsController.create);
        //
         this.get('#/delete/:_id', listingsController.deleteListing);
        // this.get('#/edit/:_id', viewController.renderEdit);
        // this.post('#/edit/:_id', listingsController.edit);
    });

    app.run();
});