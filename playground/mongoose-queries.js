const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

const id = '58e121fffeff7508bb338422';
const userId = '58e1143a48ec910797dea818';
const nonExistingId = '68e121fffeff7508bb338422';
const invalidId = nonExistingId + '1';

console.log('Is valid id "Coconut"?', ObjectID.isValid('Coconut'));
console.log('Is valid id "id"?', ObjectID.isValid(id));
console.log('Is valid id "invalidId"?', ObjectID.isValid(invalidId));

Todo.find({
    _id: id
}).then(todos => {
    console.log('Todos', todos);
});

Todo.findOne({
    _id: id
}).then(todo => {
    console.log('Todo', todo);
});

Todo.findById(id)
    .select('text')
    .then(text => console.log('Todo Text: ', text));

// Gives null value, so just check if yhou have a the document and proceed accordingly
Todo.findById(invalidId).then(todo => console.log('Todo', todo));

User.findById(userId)
.then(user => {
    if (!user) {
        return console.log('User not found!', userId);
    }
    console.log('User found', user);
})
.catch(err => console.log(`Error retrieving User by id ${userId}`, err));