const express = require("express");
const router = express.Router();
const fetch = require("node-fetch")

let api_key = "5a1900c39d7e4c3fb71192249221102"


router.get("/country",async (req,res) => 
{
    try {
        let country = req.query.c
        let current_weather = `http://api.weatherapi.com/v1/current.json?key={api_key}&q={country}`
        let data = await fetch(current_weather)
        console.log(data)
        return data 
    }
    catch(e){
        console.log("could not get data")
        console.log(e)
    }
})

module.exports = router;