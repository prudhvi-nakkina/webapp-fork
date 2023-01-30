const bcrypt = require("bcrypt");

let bhash = (password, saltRounds) => {
    bcrypt
        .hash(password, saltRounds)
        .then(hash => {
            console.log('Hash ', hash);
            return hash;
        })
        .catch(err => console.error(err.message));
};
module.exports = bhash;

