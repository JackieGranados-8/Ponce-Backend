
//blocks anyone that doesnt have password, only i can access

module.exports = (req, res, next) => {
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    const entered = req.headers['x-admin-password']; // or req.query.password

    if (!entered || entered !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    next();
};
