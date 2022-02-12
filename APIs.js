const express = require("express");
const router = express.Router();
const fetch = require("node-fetch")

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('a86177dcb8ff4b6d90cbb1f7defdad70');

let weather_api_key = "5a1900c39d7e4c3fb71192249221102"


router.get("/weather",async (req,res) => 
{
    try {
        let long = req.query.lon // get city from query that's comming from client
        let lat = req.query.lat   
        //call weather api with city
        let current_weather = `http://api.weatherapi.com/v1/current.json?key=${weather_api_key}&q=${long},${lat}`
        let data = await fetch(current_weather) // call the actual API part 1
        let json = await data.json() // call the actual API part 2
        console.log(json) // turn to json
        res.send(json) // send back to client
    }
    catch(e){
        console.log("could not get data")
        console.log(e)
    }
})

router.get("/latlong",async (req,res) => 
{
    try {
        let city = req.query.c
        let latlongapistring = `http://latlongapi&city=${city}`
        let data = await fetch(latlongapistring)
        let json = await data.json()
        console.log(json)
        res.send(json)
    }
    catch(e){
        console.log("could not get data")
        console.log(e)
    }
})


router.get("/headlines",async (req,res) => 
{
    try 
    {
        let country = req.query.c
        let data = await newsapi.v2.topHeadlines({country:country})
        let json = data
        console.log(json)
        res.send(json)
    }
    catch(e) 
    {
        console.log("failed headlines")
        console.log(e)
    }
})

router.get("/friends",async (req,res) => 
{
    try 
    {
        users = [{"Name":"Test","Country":"uk","City":"Scotland"}]
        req.send(users)
    }
    catch 
    {

    }
})

module.exports = router;