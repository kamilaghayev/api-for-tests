const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 6060;
const COMMENTS_FILE = path.join(__dirname, 'comments.json');

app.use(bodyParser.json());
app.use(cors());

const loadComments = () => {
    if (fs.existsSync(COMMENTS_FILE)) {
        const data = fs.readFileSync(COMMENTS_FILE, 'utf8');
        return JSON.parse(data);
    }
    return [];
};

const saveComments = (comments) => {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
};

let comments = loadComments();

app.get('/comments', (req, res) => {
    res.json(comments);
});

app.post('/comments', (req, res) => {
	if (!req.body) {
		return res.status(400).json({ message: 'No data provided' });
	}
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'text are required' });
    }
    const newComment = { id: comments.length + 1, text, date: new Date() };
    comments.push(newComment);
    saveComments(comments);
    res.status(201).json(newComment);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});