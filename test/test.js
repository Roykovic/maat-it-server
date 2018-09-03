process.env.NODE_ENV = 'test';

var app = require('../index');
var Attendant = require('../models/attendant');
var Client = require('../models/client');
var ClientAuth = require('../models/clientAuth');
var ClientTask = require('../models/clientTask');
var Task = require('../models/task');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

//CLIENT TASKS UNITTESTS

describe('/GET clientTasks', () => {
    it('it should GET all the clientTasks', (done) => {
    chai.request("http://localhost:5000")
        .get('/client-tasks')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
        done();
        });
    });
});

describe('/POST clientTasks', () => {
    it('it should POST the clienttask with mintimer when no timer is provided',(done) =>
{
    let clientTask = {
        clientId: "5af19a3c4abefe0004b9c410",
        taskId: "5b069a57112d320004a03b0b",
        startTime: "2018-08-29T19:07:00.000Z"
    }
    chai.request("http://localhost:5000")
        .post('/client-tasks')
        .send(clientTask)
        .end((err, res) => {
        res.should.have.status(200);
     res.body.should.be.a('object');
     res.body.should.have.property('timer').eql(3000); //3000 is the mintime for task 5b069a57112d320004a03b0b

    done();
});
});
});

describe('/POST clientTasks', () => {
    it('it should POST the clienttask',(done) =>
{
    let clientTask = {
        clientId: "5af19a3c4abefe0004b9c410",
        taskId: "5b069a57112d320004a03b0b",
        startTime: "2018-08-29T19:07:00.000Z",
        timer: 5000
    }
    chai.request("http://localhost:5000")
        .post('/client-tasks')
        .send(clientTask)
        .end((err, res) => {
        res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.should.have.property('clientId').eql("5af19a3c4abefe0004b9c410");
    res.body.should.have.property('taskId').eql("5b069a57112d320004a03b0b");
    res.body.should.have.property('startTime').eql("2018-08-29T19:07:00.000Z");
    res.body.should.have.property('timer').eql(5000);

    done();
});
});
});

// CLIENT AUTHS UNITTESTS

describe('/GET clientAuths', () => {
    it('it should GET the client auth with provided id', (done) => {
    chai.request("http://localhost:5000")
        .get('/client-auths/0000')
        .end((err, res) => {
        res.should.have.status(200);
    res.body.should.be.a('string');
    done();
});
});
});

describe('/GET clientAuths', () => {
    it('it should return 404 when provided id does not exist', (done) => {
    chai.request("http://localhost:5000")
        .get('/client-auths/00000') // id 00000 does not exist
        .end((err, res) => {
        res.should.have.status(404);
    done();
});
});
});

describe('/POST clientAuths', () => {
    it('Should return true for valid clientId and id',(done) =>
{
    let clientAuth = {
        clientId: "5af19a3c4abefe0004b9c410"
    }
    chai.request("http://localhost:5000")
        .post('/client-auths/0000')
        .send(clientAuth)
        .end((err, res) => {
        res.should.have.status(200);
    res.body.should.be.a('boolean').eql(true);

    done();
});
});
});

describe('/POST clientAuths', () => {
    it('it should return 404 when there is no clientauth with provided id',(done) =>
{
    let clientAuth = {
        clientId: "5af19a3c4abefe0004b9c410"
    }
    chai.request("http://localhost:5000")
        .post('/client-auths/00000')    //id 00000 does not exist
        .send(clientAuth)
        .end((err, res) => {
        res.should.have.status(404);

    done();
});
});
});


