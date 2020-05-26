const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const date = require(`${__dirname}/date`);

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`));

app.set('view engine', 'ejs');
const items = ['Write new book'], workItems = [];

app.get('/', (req, res) => {  
    const day = date.getDate();

    res.render('list', {
        listTitle: day,
        newItem: items
    });
});

app.get('/work', (req, res) => { 
    res.render('list', {
        listTitle:'Work',
        newItem: workItems
    });
});

app.post('/', (req, res) => {
    const item =  req.body.newItem;
    if (req.body.list == 'Work') {
        workItems.push(item);
        res.redirect('/work');
    } else {
        items.push(item);
        res.redirect('/');
    }
});


app.listen(process.env.PORT || 3000, () => {
    console.log('server is running on port 3000');
});