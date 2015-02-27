'use strict';

var express = require('express');
var schema_account_details = require('./schema_account_details');
var controller = require('./signup');

var router = express.Router();

/*router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
*/

router.post('/', controller.signup);


module.exports = router;