const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// Todo.remove({}).then(result => console.log(result));

// Todo.findOneAndRemove({ })

Todo.findByIdAndRemove('58e13181cf8cebae61609eff').then(result => console.log('Removed Document', result));