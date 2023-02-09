let request = require('supertest');
let expect = require("chai").expect;
let server = require('../server');

describe('/GET health check', function () {

    it('it should return 200 ok response', async function () {

        const response = await request(server).get("/healthz");

        expect(response.status).to.eql(400);
        expect(response.body.success).to.eql(true);
    });
});
