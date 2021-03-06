'use strict';

/**
 * Your utility library for express
 */

var jwt = require('jsonwebtoken');
//var configJWT = require('../local_config').jwt;

/**
 * JWT auth middleware for use with Express 4.x.
 *
 * @example
 * app.use('/api-requiring-auth', jwtAuth());
 *
 * @returns {function} Express 4 middleware
 */
module.exports = function() {

    return function(req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        var lang = req.query.lang || req.query.lang || req.headers['lang'];
        if ( lang === 'es' ){
            var msgs = require('../i18n/apimsg_es.json');
        }else{
            var msgs = require('../i18n/apimsg_en.json');
        }

        console.log('Token:', token);

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, 'bUmLXMnLX6WiCc', function(err, decoded) {
                if (err) {

                    return res.json({ ok: false, error: {code: 401, message: msgs.failed_auth}});
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    console.log('decoded', decoded);
                    next();
                }
            });

        } else {

            // if there is no token return error
            return res.status(403).json({
                ok: false,
                error: { code: 403, message: msgs.no_token}
            });

        }
    };
};