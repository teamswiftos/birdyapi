const { get_file, get, add } = require(`${process.cwd()}/dbwrapper`);
module.exports = {
    method: 'GET',
    json: {
        content: String
    },
    Header: {},
    run: function(req, res, json, header) {
        let data = get(json.content);
        let newname = json.content + 'tar.gz';
        res.download(get_file(data.file), newname, (err) => {
            if (err) {
                res.status(404).send('Module not found.');
            }
        });
        const ndown = data.downloads + 1;
        if (ndown === 10000000) {
            data.verified = true;
        }
        add(json.content, {downloads: data.downloads + 1, verified: data.verified});
        data.file = newname;
        res.status(200).send({info: data});
    }
}