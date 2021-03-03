const express = require("express");

const app = express();

const path = require("path");

var PORT =process.env.PORT || 8000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));

app.get("/notes", (req, res)=>{
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

var database = require("./db/db.json");

const fs = require("fs");

app.get("/api/notes", (req, res)=>{
    fs.readFile("./db/db.json", "utf8", (error, data)=>{
        if(error){
            res.writeHead(500);
            res.end();
            return;
        }
        res.json(JSON.parse(data));
    });
});

var idi = 0;
app.post("/api/notes", (req, res)=>{
    var data = {
title: req.body.title,
text: req.body.text,
id: idi++,
    }
    
    database.push(data);
    console.log(database);
    fs.writeFile("./db/db.json", JSON.stringify (database), function(error){
        if(error){
            res.writeHead(500);
            res.end();
            return;
        }
        res.json(data);
    })
    
});


app.delete("/api/notes/:id", (req, res)=>{
    var id = req.params.id;
    var array = [];
    for(var i = 0; i<database.length; i++){
        if(i!=id){
            array.push(database[i])
        }
    }
    fs.writeFile("./db/db.json", JSON.stringify (array), function(error){
        if(error){
            res.writeHead(500);
            res.end();
            return;
        }
        res.send(true);
    })
})




















app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "./public/index.html"));
});


app.listen(PORT, function(){
    console.log("App listening on PORT: " + PORT);
});