const { search_relative } = require(`${process.cwd()}/dbwrapper`);
module.exports = {
    method: 'GET',
    json: {
        content: String
    },
    Header: {},
    run: function(req, res, json, header) {
        res.status(200).send({results: search_relative(json.content)});
    }
}