const mongoose = require('mongoose')
require('dotenv').config()

const recipeUri = process.env.MONGODB

async function connectDB () {
    await mongoose
        .connect(recipeUri)
        .then(() => {
            console.log("Connected to database")
        })
        .catch((error) => {
            console.log("Error connecting to database", error)
        })
}

module.exports = {connectDB}