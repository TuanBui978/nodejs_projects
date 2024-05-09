const connect = require('../config/database');

const createUserJob = async (req, res) => {
    const userID = req.query.userID;
    const jobID = req.query.jobID;

    try {
        const query = "INSERT INTO USERJOB(USER_ID, JOB_ID) VALUES(?, ?)";
        const [result] = await connect.promise().query(query, [userID, jobID]);
        res.status(200).json({ cod: "200", msg: "Create User Job successfully !" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ cod: "500", msg: 'Failed to create user job !' });
    }

};

const deleteUserJob = async (req, res) => {
    const id = req.query.id;

    try {
        const query = "DELETE FROM USERJOB WHERE ID = ?";
        const result = await connect.promise().query(query, [id]);

        if (result[0].affectedRows === 0) {
            return res.status(404).send({ error: 'UserJob not found' });
        }

        res.status(200).json({ cod: "200", msg: "Delete User Job successfully !" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ cod: "500", msg: 'Failed to delete user job !' });
    }
};
module.exports = {
    createUserJob,
    deleteUserJob
}