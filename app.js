import bodyParser from "body-parser";
import express from "express";
import fetch from "node-fetch";
import mongoose from "mongoose";
const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/internshipDB");

const userSchema = new mongoose.Schema({
    name:String,
    last:Number,
    buy:Number,
    sell:Number,
    volume:Number,
    base_unit:String
});

const User = mongoose.model("User",userSchema);

app.use(bodyParser.urlencoded({
    extended:true
}));


// below code using async await:
async  function getWazirxData(){
    let response = await fetch("https://api.wazirx.com/api/v2/tickers");
    let data = await response.json();
    // keys is an array of all the keys in the data object
    let keys = Object.keys(data);
    for(let i=0;i<keys.length;i++){
        let name = keys[i];
        let last = data[name]["last"];
        let buy = data[name]["buy"];
        let sell = data[name]["sell"];
        let volume = data[name]["volume"];
        let base_unit = data[name]["base_unit"];
        let user = new User({
            name:name,
            last:last,
            buy:buy,
            sell:sell,
            volume:volume,
            base_unit:base_unit
        });
        await user.save();
    }
}

// calling the function:
getWazirxData();

// show data from mongodb to frontend using expressjs
app.get("/",(req,res)=>{
    // using async-await:
    async function showData(){
        let users = await User.find({}).limit(10);  // limit(10) means only 10 data will be shown
        res.send(users);
    }
    showData();
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

