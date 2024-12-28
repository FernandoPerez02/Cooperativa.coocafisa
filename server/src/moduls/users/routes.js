const express = require('express');

const request = require('../../red/request');
const controller = require('./index');

const router = express.Router();

router.get('/', consult);

async function consult(req, res, next) {
    try {
        const items = await controller.Suppliers();
        request.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
};

module.exports = router;