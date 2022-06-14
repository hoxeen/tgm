// exports.allAccess = (req, res) => {
//     res.status(200).send("auth");
// };
// exports.userBoard = (req, res) => {
//     res.status(200).send("user");
// };
exports.isRole = (req, res) => {
    res.status(200).send(true);
};