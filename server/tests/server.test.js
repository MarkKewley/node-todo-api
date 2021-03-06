const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

describe('Server Test', () => {
    const todos = [
        {
            _id: new ObjectID(),
            text: 'First Test Todo'
        },
        {
            _id: new ObjectID(),
            text: 'Second Test Todo',
            completed: true,
            completedAt: 333
        }
    ];

    beforeEach(done => {
        Todo.remove({}).then(() => Todo.insertMany(todos)).then(() => done());
    });

    describe('POST /todos', () => {

        it('should create a new todo', done => {
            let text = 'Test todo text';

            request(app)
                .post('/todos')
                .send({ text })
                .expect(200)
                .expect(res => expect(res.body.text).toBe(text))
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Todo.find({ text })
                        .then(todos => {
                            expect(todos.length).toBe(1);
                            expect(todos[0].text).toBe(text);
                            done();
                        })
                        .catch(err => done(err));
                });
        });

        it('should NOT create a new todo with bad data', done => {
            request(app)
                .post('/todos')
                .send({})
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Todo.find()
                        .then(todos => {
                            expect(todos.length).toBe(2);
                            done();
                        })
                        .catch(err => done(err));
                })
        })

    });

    describe('GET /todos', () => {

        it('should retrieve todos', done => {
            request(app)
                .get('/todos')
                .expect(200)
                .expect(res => expect(res.body.todos.length).toBe(2))
                .end(done);
        })
    });

    describe('GET /todos/:id', () => {

        it('Should return a todo document', done => {
            request(app)
                .get(`/todos/${todos[0]._id}`)
                .expect(200)
                .expect(res => expect(res.body.todo.text).toBe(todos[0].text))
                .end(done);
        });

        it('Should return a 404 when id does not exist', done => {
            const hexId = new ObjectID().toHexString();
            request(app)
                .get(`/todos/${hexId}`)
                .expect(404)
                .end(done);
        });

        it ('Should return a 404 when id is invalid', done => {
            request(app)
                .get(`/todos/COCONUT`)
                .expect(404)
                .end(done);
        });

    });

    describe('DELETE /todos/:id', () => {

        it('Should delete a todo document', done => {
            const hexId = todos[0]._id.toHexString();

            request(app)
                .delete(`/todos/${hexId}`)
                .expect(200)
                .expect(res => expect(res.body.todo._id).toBe(hexId))
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Todo.findById(hexId)
                        .then(todo => {
                            expect(todo).toNotExist();
                            done();
                        })
                        .catch(err => done(err));
                });
        });

        it('Should return a 404 when an id does not exist', done => {
            const hexId = new ObjectID().toHexString();
            request(app)
                .delete(`/todos/${hexId}`)
                .expect(404)
                .end(done);
        });

        it('Should return a 404 when id is invalid', done => {
            request(app)
                .delete(`/todos/COCONUT`)
                .expect(404)
                .end(done);
        });
    });

    describe('PATCH /todos/:id', () => {
        it('Should update the todo', done => {
            const hexId = todos[0]._id.toHexString();
            const newText = 'I\'ve got a lovely bunch of coconuts';

            request(app)
                .patch(`/todos/${hexId}`)
                .send({ completed: true, text: newText})
                .expect(200)
                .expect(res => {
                    const { todo } = res.body;
                    expect(todo.completed).toBe(true);
                    expect(todo.text).toBe(newText);
                    expect(todo.completedAt).toBeA('number');
                })
                .end(done);
        });

        it('Should clear completedAt when todo is not completed', done => {
            const hexId = todos[1]._id.toHexString();
            const newText = 'I\'ve got a lovely bunch of coconuts';

            request(app)
                .patch(`/todos/${hexId}`)
                .send({ completed: false, text: newText })
                .expect(200)
                .expect(res => {
                    const { todo } = res.body;
                    expect(todo.completed).toBe(false);
                    expect(todo.text).toBe(newText);
                    expect(todo.completedAt).toNotExist();
                })
                .end(done);
        });
    });
});