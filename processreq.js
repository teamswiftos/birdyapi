module.exports = function(req, res, endpoints) {
    const endpoint = endpoints[req.params.endpoint];
    if (!endpoint) {
        res.status(404).send('Not found');
        return;
    }
    const json_data = JSON.parse(req.body);
    for (const dat of endpoint.json) {
        const da = json_data[dat];
        if (!da) {
            res.status(400).send(`Missing one argument ${dat}!`);
            return;
        }
        if ((typeof da) === endpoint.json[dat]) {
            res.status(400).send(`Invalid argument type please use the right type!`);
            return;
        }
    }
    const header_data = JSON.parse(req.header);
    for (const dat of endpoint.Header) {
        const da = header_data[dat];
        if (!da) {
            res.status(400).send(`Missing one argument in the header ${dat}!`);
            return;
        }
        if ((typeof da) === endpoint.json[dat]) {
            res.status(400).send(`Invalid argument type in the header, please use the right type!`);
            return;
        }
    }
    endpoint.run(req, res, json_data, header_data);
}