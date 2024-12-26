const express = require('express');

const request = require('../../red/request');
const controller = require('./index');

const router = express.Router();

router.get('/prueba', consult);

async function consult(req, res, next) {
    try {
        const items = await controller.consultUser(req.body);
        request.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
};

module.exports = router;