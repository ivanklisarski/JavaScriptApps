;const listingsController = (function () {

    /** Fn for Get on delete listing */
    function deleteListing(context) {
        const listingId = context.params._id.substring(1);

        listingModel.removeListing(listingId)
            .then(function (res) {
                handler.showInfo(`Pet removed successfully!`);
                viewController.myListings(context);
            }).catch(handler.handleError)
    }

    /** Fn for Post on edit listing */
    function edit(context) {


        const petId = context.params.petId;
        const data = {

            name: context.params.name,
            description: context.params.description,
            imageUrl: context.params.imageUrl,
            category: context.params.category,
            likes: context.params.likes
        };

        listingModel.edit(petId, data)
            .then(function (res) {
                handler.showInfo(`Successfully edited!`);
                viewController.allListings(context);

            }).catch(handler.handleError);
    }

    /** Fn for Post on create listing */
    function create(context) {

        const data = {

            name: context.params.name,
            description: context.params.description,
            imageUrl: context.params.imageUrl,
            category: context.params.category,
            likes: context.params.likes
        };

        listingModel.create(data)
            .then(function (res) {
                handler.showInfo(`Pet created.`);
              //  viewController.allListings(context);
                viewController.renderHomePage(context);
            }).catch(handler.handleError);
    }

    return {
        deleteListing,
       // edit,
        create
    }
})();