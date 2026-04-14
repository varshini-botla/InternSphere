const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'db.json');

const readDB = () => {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        const defaults = { users: [], jobs: [], applications: [], companies: [] };
        fs.writeFileSync(dbPath, JSON.stringify(defaults, null, 2));
        return defaults;
    }
};

const writeDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Emulate lowdb-like chainable API (partial)
const db = {
    get: (key) => {
        const data = readDB();
        const collection = data[key] || [];

        return {
            find: (query) => {
                const item = collection.find(i => Object.keys(query).every(k => i[k] === query[k]));
                return {
                    value: () => item,
                    assign: (updates) => {
                        const index = collection.findIndex(i => i.id === item.id);
                        if (index !== -1) {
                            collection[index] = { ...collection[index], ...updates };
                            writeDB({ ...data, [key]: collection });
                        }
                        return { write: () => { } };
                    }
                };
            },
            filter: (query) => {
                const items = collection.filter(i => Object.keys(query).every(k => i[k] === query[k]));
                return { value: () => items };
            },
            push: (item) => {
                collection.push(item);
                return {
                    write: () => writeDB({ ...data, [key]: collection })
                };
            },
            remove: (query) => {
                const filtered = collection.filter(i => !Object.keys(query).every(k => i[k] === query[k]));
                return {
                    write: () => writeDB({ ...data, [key]: filtered })
                };
            },
            value: () => collection
        };
    },
    defaults: () => ({
        write: () => {
            if (!fs.existsSync(dbPath)) {
                writeDB({ users: [], jobs: [], applications: [], companies: [] });
            }
        }
    })
};

module.exports = db;
