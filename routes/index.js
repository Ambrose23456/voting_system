const express = require("express")
const db = require("../db")
const router = express.Router()

router.get("/", (req, res) => {
    
    res.render("index")
})

// render states
router.get("/states", async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM states ORDER BY state_name ASC;")

        if(!results[0].length) throw new Error("No result found")

        res.render("states", { results: results[0] })

    } catch(error) {
        res.render("error", { msg: error.message})
    }
})

router.get("/lga/:id", async (req, res) => {
    try {
        const state_id = req.params.id
        const results = await db.execute("SELECT lga_id, lga_name FROM lga WHERE state_id = ?;", [ state_id ])

        if(!results[0].length) throw new Error("No result found")

        res.render("lgas", { results: results[0] })

    } catch(error) {
        res.render("error", { msg: error.message})
    }
})

router.get("/polling-units/:id", async (req, res) => {
    try {
        const lga_id = req.params.id
        const results = await db.execute("SELECT uniqueid, polling_unit_number, polling_unit_name FROM polling_unit WHERE lga_id = ?;", [ lga_id ])

        if(!results[0].length) throw new Error("No result found")

        res.render("polling-units", { results: results[0] })

    } catch(error) {
        res.render("error", { msg: error.message})
    }
})

router.get("/polling-results/:id", async (req, res) => {
    try {
        const uniqueid = req.params.id
        const results = await db.execute("SELECT party_abbreviation, party_score FROM announced_pu_results WHERE polling_unit_uniqueid = ?;", [ uniqueid ])

        if(!results[0].length) throw new Error("No result found")

        res.render("polling-results", { results: results[0] })

    } catch(error) {
        res.render("error", { msg: error.message})
    }
})

router.get("/sum-total", async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM states ORDER BY state_name ASC;")

        if(!results[0].length) throw new Error("No result found")

        res.render("sum-total", { results: results[0] })

    } catch(error) {
        res.render("error", { msg: error.message})
    }
})

router.get("/api/state/:id/lgas", async (req, res) => {
    try {
        const state_id = req.params.id
        const results = await db.execute("SELECT lga_id, lga_name FROM lga WHERE state_id = ?;", [ state_id ])

        if(!results[0].length) throw new Error("No result found")

        res.status(200).json({ status: true, results: results[0] })

    } catch(error) {
        res.status(500).json({ status: false, msg: error.message})
    }
})

router.get("/api/lga/:id/sum-total", async (req, res) => {
    try {
        const lga_id = req.params.id
        const results = await db.execute("SELECT uniqueid FROM polling_unit WHERE lga_id = ?;", [ lga_id ])
        if(results[0].length > 0) {
            // console.log(results[0])
            const ids = results[0].map(item => item.uniqueid)
            // console.log(ids)
            const queryIds = ids.join(", ")
            // console.log(results[0])
            const results2 = await db.query(`SELECT SUM(party_score) AS sum_total FROM announced_pu_results WHERE polling_unit_uniqueid IN (${queryIds});`)

            if(results2[0].length > 0) {
                res.status(200).json({ status: true, result: results2[0][0].sum_total })
            } else {
                throw new Error("No result found")
            }
        } else {
            throw new Error("No polling units found")
        }
    } catch(error) {
        res.status(500).json({ status: false, msg: error.message})
    }
})

module.exports = router