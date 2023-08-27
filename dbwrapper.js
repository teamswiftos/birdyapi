const fs = require('fs');
let modules = {};
fs.readdirSync('./db/info').forEach(file => {
    modules[file.replace('.js', '')] = require('./db/modules/' + file);
});
let accounts = {};
fs.readdirSync('./db/accounts').forEach(file => {
    accounts[file.replace('.js', '')] = require('./db/modules/' + file);
});
module.exports = {
    search_relative: function(query) {
        return Object.keys(modules)
            .filter(key => modules[key].name.toLowerCase().includes(searchTerm))
            .map(key => {
                return {key: modules[key]}
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    },
    get: function(query) {
        return modules[query];
    },
    get_file: function(file) {
        return fs.readFileSync(`./db/modules/${file}`, 'utf-8');
    },
    checkusr: function(username, password) {
        const real_password = accounts[username].password;
        if (!real_password || real_password !== password) {
            return false;
        }
        return true;
    },
    search: function(query) {
        const data = modules[query];
        if (!data) {
            return false;
        }
        return true;
    },
    set: function(query, content, filename = null, file = null) {
        modules[query] = content;
        if (filename && filename) {
            fs.writeFileSync(`./db/modules/${file}`, file);
        }
        fs.writeFileSync(`./db/info/${query}.js`, content);
    },
    add: function(query, content) {
        const old_content = this.get(query);
        if (!old_content) {
            this.set(query, content);
            return;
        }
        for (const content_key in content) {
            old_content[content_key] = content[content_key];
        }
        this.set(query, content);
    },
    remove: function(query) {
        const info = this.get(query);
        delete modules[query];
        for (const file in [`./db/info/${query}.js`, `./db/modules/${info.file}`]) {
            fs.removeSync(file);
        }
    }
}