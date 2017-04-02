const { MongoClient, ObjectID } = require('mongodb');


const TodoCollection = 'Todos';
const UserCollection = 'Users';

const insertDocument = (db, collectionName, document) => {
    db.collection(collectionName).insertOne(document, (err, result) => {
        if (err) {
            return console.log('Unable to insert document', err);
        }

        console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2))
    })
};

const findDocuments = (db, collectionName, query) => {
    db.collection(collectionName)
        .find(query)
        .toArray()
        .then(docs => {
           console.log('Todos');
           console.log(JSON.stringify(docs, undefined, 2))
        })
        .catch(err => {
            console.log('Unable to fetch todos', err)
        });
};


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server', err);
    }
    console.log('Connected to MongoDB server');

    findDocuments(db, UserCollection, { name: 'Mark' });

    db.close();
});