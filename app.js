const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/toDoListDB';

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`));

app.set('view engine', 'ejs');

mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true});

const itemsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const listSchema = mongoose.Schema({
    name: String,
    item: [itemsSchema]
});

const Item = mongoose.model('Item', itemsSchema);
const List = mongoose.model('List', listSchema);

const item1 = new Item({
    name: 'Welcome to your Daily List'
});

const item2 = new Item({
    name: 'Click the + sign to add a new item'
});

const item3 = new Item({
    name: 'Click the garbage icon to delete an item'
});

const defaultList = [item1, item2, item3];



app.get('/', (req, res) => {  
    const options = { weekday: "long", year: "numeric", month: "short",  day: "numeric" };
    const date = new Date().toLocaleDateString('en-us', options);

    Item.find({}, (err, itemsFound) => {
        if(itemsFound.length === 0) {
            Item.insertMany(defaultList, (err) => {
                if(err) {
                    console.log(error);
                } else {
                    console.log('Documents successfully inserted!');
                }
            });
            res.redirect('/');
        } else {
            res.render('list', {
                listTitle: 'Today',
                newItem: itemsFound
            });
        }
    });
    
});

app.get('/:customList', (req, res) => {
    const customList = req.params.customList.capitalize();

    List.findOne({name:customList}, (err, listFound) => {
        if(!err) {
            if(!listFound) {
                const list = new List({
                    name: customList,
                    item: defaultList
                });
                list.save();
                res.redirect(`/${customList}`);
            } else {
                res.render('list', {
                    listTitle: listFound.name,
                    newItem: listFound.item
                });
            }
        }
    });
});


app.post('/', (req, res) => {
    const itemName =  req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if(listName === 'Today') {
        item.save();
        res.redirect('/');
    } else {
        List.findOne({name: listName}, (err, foundList) => {
            foundList.item.push(item);
            foundList.save();
            res.redirect(`/${listName}`)
        });
    }

    
});

app.post('/remove', (req, res) => {
    const deletedItemId = req.body.delete;
    const listName = req.body.listName;
    if(listName === 'Today') {
        Item.findByIdAndDelete(deletedItemId, (err) => {
            if(err) {
                console.log(err);
            } else {
                console.log('Successfully deleted item!');
                res.redirect('/');
            }
        });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {item: {_id: deletedItemId}}}, (err, foundList) => {
            if(!err) {
                res.redirect(`/${listName}`);
            }
        });
    }
    
});


app.listen(process.env.PORT || 3100, () => {
    console.log('server is running on port 3100');
});


// <%const y = x.toLowerCase().split(' ').map((a) => { %>
// <% return a.replace(a[0], a[0].toUpperCase())}).join('')%>