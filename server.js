const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/root'));
app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')){
            res.sendFile(path.join(__dirname, 'public/views/404.html'));
    }
    else if(req.accepts('json')){
        res.json({error: 'Not found'});
    }
    else{
        res.type('txt').send('Not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
