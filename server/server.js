const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT || 9001;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });
    todo.save()
        .then(doc => {
            res.send(doc)
        })
        .catch(err => {
            res.status(400).send(err)
        })
});

app.get('/todos', (req, res) => {
    Todo.find()
        .then(todos => res.send({ todos }))
        .catch(err => res.status(500).send(err))
});

app.get('/todos/:id', (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send(`Invalid Id: ${id}`)
    }

    Todo.findById(id)
        .then(todo => {
            if (!todo) {
                return res.status(404).send(`Unable to find todo: ${id}`);
            }
            res.send({ todo })
        })
        .catch(err => res.send(500))
});

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send(`Invalid Id: ${id}`);
    }

    Todo.findByIdAndRemove(id)
        .then(todo => {
            if (!todo) {
                return res.status(404).send(`No such todo exists!: ${id}`);
            }
            res.send({ todo });
        })
        .catch(err => res.send(500))
})

app.listen(port, () => {
    console.log(`Started on port: ${port}`);
});

module.exports = { app };