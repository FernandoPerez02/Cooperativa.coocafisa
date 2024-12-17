const express = require("express");
const router = express.Router();
const obtainTimer = require("../../email/report/hourprogram.json");

router.get("/timer", async (req, res) => {
    try {
        const { hour, minute } = obtainTimer;
        return res.status(200).json ({ hour, minute });
    } catch (error) {
        return res.status(500).json({ message: "Error en solicitud al servidor.", error });
    }
});

module.exports = router;