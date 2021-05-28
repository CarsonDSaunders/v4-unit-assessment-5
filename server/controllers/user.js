const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req, res) => {
        let { username, password } = req.body;
        const db = req.app.get('db');
        let result = await db.user.find_user_by_username([username])
        if (result) {
            return res.status(407).send('Username is taken.')
        } else {   
            req.session.username = username;
            let salt = bcrypt.genSaltSync(15);
            let hashedPassword = bcrypt.hashSync(password, salt);
            req.session.password = hashedPassword;
            req.session.profile_pic = `https://robohash.org/${username}.png`;
        }
    },
    login: async (req, res) => {
        let { username, password } = req.body;
        const db = req.app.get('db');
        let result = await db.user.find_user_by_username([username])
        if (result) {
            let hashedPassword = result.password;
            let authenticated = bcrypt.compareSync(password, hashedPassword);
            if (result.username === username && authenticated) {
                req.session.user = result;
                res.status(200).send(result)
            }
        } else {   
            return res.status(404).send(`User ${username} does not exist. Please try again.`)
        }
    },
    logout: async (req, res) => {
        req.session.destroy();
        res.status(200).send('User successfully logged out.')
    },
    getUser: async (req, res) => {
        let { username } = req.body;
        const db = req.app.get('db');
        let result = await db.user.find_user_by_username([username])
        if (result) {
            return res.status(200).send(`User ${result.username} is logged in.`)
        } else {   
            return res.status(404).send(`User ${username} not found.`)
        } 
    },
}