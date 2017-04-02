const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.PORT = 9001;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
    process.env.PORT = 9001;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT;

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
});

app.patch('/todos/:id', (req, res) => {
   const { id } = req.params;
   const body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send(`Invalid Id: ${id}`);
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
        .then(todo => {
            if (!todo) {
                return res.status(404).send();
            }

            res.send({ todo });
        })
        .catch(err => res.status(400).send())

});

app.listen(port, () => {
    console.log(`Started on port: ${port}`);
});

module.exports = { app };