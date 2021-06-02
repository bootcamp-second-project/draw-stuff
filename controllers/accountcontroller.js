const router = require('express').Router();

// The `/api/account` endpoint


/**
    A get request to /api/account/5
    would return info about user with ID 5

    body: none
    returns: {@link User}
 */
router.get('/:id', async (req, res) => {
    res.status(200).send({ "status": "test" });
});

/**
    A post request to /api/account

    body: {
        username: string,
        hashedPassword: string,
        avatarImageBase64?: string
    }
    returns: {@link User}
 */
router.post('/', async (req, res) => {
    res.status(200).send({ "status": "test" });
});

/**
    A put request to /api/account

    body: {
        newPassword?: string,
        newAvatar?: string
    }
    returns: {@link User}
 */
router.put('/:id', async (req, res) => {
    res.status(200).send({ "status": "test" });

});



module.exports = router;
