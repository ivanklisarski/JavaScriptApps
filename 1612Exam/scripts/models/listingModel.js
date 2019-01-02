;const listingModel = (function () {

    function getAllListings() {

        return requester.get('appdata', 'pets', 'Kinvey');
    }

    function getById(id) {
        const endpoint = `pets/${id}`;
        return requester.get('appdata', endpoint, 'Kinvey');
    }

    function create(data) {
        return requester.post('appdata', 'pets', 'Kinvey', data);
    }

    function removeListing(id) {
        const endpoint = `pets/${id}`;
        return requester.remove('appdata', endpoint, 'Kinvey');
    }

    function edit(id, data) {
        const endpoint = `pets/${id}`;
        return requester.update('appdata', endpoint, 'Kinvey', data)
    }

    return {
         getAllListings,
         getById,
        create,
         removeListing,
        // edit
    }
})();