router.route('/')
    .post(createClientAuth);

router.route('/:id')
    .post(addClientId)
    .get(find);


module.exports = function (errCallback){
    console.log('Initializing clientAuths routing module');

    handleError = errCallback;
    return router;
}
