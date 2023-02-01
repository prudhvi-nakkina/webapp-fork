let request = require('supertest');
let expect = require("chai").expect;
let server = require('../server');

describe('/POST user', function () {

    it('it should not POST a user with invalid username', async function () {
        let user = {
            first_name: "test user",
            last_name: "user test",
            username: "testusername",
            password: "testpassword"
        }

        const response = await request(server).post("/v1/user").send(user);

        expect(response.status).to.eql(400);
        expect(response.body.success).to.eql(false);
    });
});