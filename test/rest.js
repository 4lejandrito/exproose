var rekuire = require('rekuire');
var expect = rekuire('chai').expect;
var rest = rekuire('src/util/rest');

describe("REST Client", function() {

    it("is an instance of node-rest-client", function() {
        expect(rest).to.be.instanceof(require('node-rest-client').Client);
    });

    it("is contains mimetipes compatible with express", function() {
        expect(rest.mimetypes).to.be.eql({
            json:[
                "application/json",
                "application/json; charset=utf-8",
                "application/json;charset=UTF-8"
            ],
            xml:[
                "application/xml",
                "application/xml; charset=utf-8"
            ]
        });
    });
});
