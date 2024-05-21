// app.js
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const km = require('./kaomoji.js');
const { Kaomoji } = require('./kaomoji.js');
const kao_dict = [];

fs.readFile(path.join(__dirname, '/code-samples/kaomojiData.json'), 'utf8', function(err, data){   
    if(!err){
        points = JSON.parse(data);
        for(let i=0; i < points.length; i++){
            const kao = new Kaomoji(points[i].value, points[i].emotions);
            kao_dict.push(kao);
        }
    } else {
        console.log('error', err);
    }
    app.listen(3000);
    console.log("Server started; type CTRL+C to shut down ");
});

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req,res) =>{
    let new_text = "";
    let old_text = "";
    if(req.query.hasOwnProperty("text")){
        old_text = req.query.text;
        words = req.query.text.split(" ");
        console.log(words);
        for(let i =0; i<words.length; i++){
            kao_dict.forEach(kaomoji => {
                if(kaomoji.emotions.includes(words[i])){
                    words[i] = kaomoji.value;
                }
            });
        }
        new_text = words.join(" ");
    }
    res.render('editor', {old_text: old_text, new_text: new_text});
});

app.get('/list', (req,res) =>{
    if(req.query.hasOwnProperty("kao") && req.query.hasOwnProperty("emotions")){
        kao_dict.push(new Kaomoji(req.query.kao, req.query.emotions));
        res.send('<head><meta http-equiv="Refresh" content="0; URL=http://localhost:3000/list""></head>');
    }
    let dict = kao_dict
    if(req.query.hasOwnProperty("text")){
        dict = kao_dict.filter(function (el) {
            return el.emotions.includes(req.query.text);
        });
    }
    res.render('list', {dictionary: dict});
});
