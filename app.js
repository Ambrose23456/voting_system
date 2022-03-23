const express = require("express")
const routes = require("./routes")

const port = process.env.PORT || 3000

const app = express()

// middleware
app.use("/assets", express.static("public"))

app.set("view engine", "ejs")

app.use("/", routes)

app.listen(port, () => console.log(`...Listening on port ${port}...`))