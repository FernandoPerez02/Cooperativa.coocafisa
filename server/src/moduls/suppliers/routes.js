const express = require('express');
const controller = require('./index');
const request = require('../../red/request');
const router = express.Router();

router.get('/querySuppliers',  querySup);

async function querySup(req, res, next) {
    try {
        const items = await controller.Suppliers();
        request.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
};

module.exports = router;