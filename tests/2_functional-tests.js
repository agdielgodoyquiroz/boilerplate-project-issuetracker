const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const testProject = 'test';
let testId = '';

suite('Functional Tests', function () {

  test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
    chai.request(server)
      .post('/api/issues/' + testProject)
      .send({
        issue_title: 'Test issue',
        issue_text: 'Testing POST',
        created_by: 'Agdiel',
        assigned_to: 'Juan',
        status_text: 'Open'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Test issue');
        assert.equal(res.body.issue_text, 'Testing POST');
        assert.equal(res.body.created_by, 'Agdiel');
        assert.equal(res.body.assigned_to, 'Juan');
        assert.equal(res.body.status_text, 'Open');
        assert.equal(res.body.open, true);
        assert.exists(res.body._id);

        testId = res.body._id;
        done();
      });
  });

  test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
    chai.request(server)
      .post('/api/issues/' + testProject)
      .send({
        issue_title: 'Required only',
        issue_text: 'Testing required',
        created_by: 'Agdiel'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Required only');
        assert.equal(res.body.assigned_to, '');
        assert.equal(res.body.status_text, '');
        done();
      });
  });

  test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
    chai.request(server)
      .post('/api/issues/' + testProject)
      .send({
        issue_title: 'Missing'
      })
      .end(function(err, res) {
        assert.deepEqual(res.body, {
          error: 'required field(s) missing'
        });
        done();
      });
  });

  test('View issues on a project: GET request to /api/issues/{project}', function(done) {
    chai.request(server)
      .get('/api/issues/' + testProject)
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
    chai.request(server)
      .get('/api/issues/' + testProject)
      .query({ created_by: 'Agdiel' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
    chai.request(server)
      .get('/api/issues/' + testProject)
      .query({
        created_by: 'Agdiel',
        open: true
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/' + testProject)
      .send({
        _id: testId,
        issue_title: 'Updated title'
      })
      .end(function(err, res) {
        assert.deepEqual(res.body, {
          result: 'successfully updated',
          _id: testId
        });
        done();
      });
  });

  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/' + testProject)
      .send({
        _id: testId,
        issue_title: 'Updated again',
        issue_text: 'New text',
        open: false
      })
      .end(function(err, res) {
        assert.deepEqual(res.body, {
          result: 'successfully updated',
          _id: testId
        });
        done();
      });
  });

  test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/' + testProject)
      .send({
        issue_title: 'No id'
      })
      .end(function(err, res) {
        assert.deepEqual(res.body, {
          error: 'missing _id'
        });
        done();
      });
  });

  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/' + testProject)
      .send({
        _id: testId
      })
      .end(function(err, res) {
        assert.deepEqual(res.body, {
          error: 'no update field(s) sent',
          _id: testId
        });
        done();
      });
  });

  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/' + testProject)
      .send({
        _id: 'invalidid',
        issue_title: 'test'
      })
      .end(function(err, res) {
        assert.deepEqual(res.body, {
          error: 'could not update',
          _id: 'invalidid'
        });
        done();
      });
  });

  test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
    chai.request(server)
      .delete('/api/issues/' + testProject)
      .send({
        _id: testId
      })
      .end(function(err, res) {
        assert.deepEqual(res.body, {
          result: 'successfully deleted',
          _id: testId
        });
        done();
      });
  });

  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
    chai.request(server)
      .delete('/api/issues/' + testProject)
      .send({
        _id: 'invalidid'
      })
      .end(function(err, res) {
        assert.deepEqual(res.body, {
          error: 'could not delete',
          _id: 'invalidid'
        });
        done();
      });
  });

  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
    chai.request(server)
      .delete('/api/issues/' + testProject)
      .send({})
      .end(function(err, res) {
        assert.deepEqual(res.body, {
          error: 'missing _id'
        });
        done();
      });
  });

});