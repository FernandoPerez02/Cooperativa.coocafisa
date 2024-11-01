const express = require('express');
const router = express.Router()

const queryDatabase = require("../../connectionBD/queryDatabase")

router.post("/", async (req, res) => {
    const {nit} = req.body;
    const dataQuery = `SELECT * from usuarios where nit = ?`;
    const total = await queryDatabase(dataQuery, [nit])
    res.send(total);
})

module.exports = router;