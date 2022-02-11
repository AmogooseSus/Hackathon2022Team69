const express = require("express");
const router = express.Router();

api_key = "5a1900c39d7e4c3fb71192249221102"
coutry = "London"
current_weather = `http://api.weatherapi.com/v1/current.json?key={api_key}&q={country}`

router.get("/country",async (req,res) => 
{
    print(req)
})