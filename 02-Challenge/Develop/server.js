const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const data = require('./db/db');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.static('public'));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);


// GET Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.route('/api/notes')
    .get(function (req, res) {
        res.json(data);
    })
    // Create a new note
    .post(function (req, res) {
        let jsonFilePath = path.join(__dirname, '/db/db.json');
        let newNote = req.body;

        newNote.id = uuidv4();
        data.push(newNote)

        fs.writeFile(jsonFilePath, JSON.stringify(data), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log('Note saved correctly');
        });
        res.json(newNote);
    });

    app.delete('/api/notes/:id', function (req, res) {
        let jFilePath = path.join(__dirname, '/db/db.json');
        for (let i = 0; i < data.length; i++) {
    
            if (data[i].id == req.params.id) {
                data.splice(i, 1);
                break;
            }
        }
        fs.writeFileSync(jFilePath, JSON.stringify(data), function (err) {
            if (err) {
                return console.log(err);
            } else {
                console.log('Note deleted successfully');
            }
        });
        res.json(data);
    });


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
