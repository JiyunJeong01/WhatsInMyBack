exports.showPost = (req, res) => {
    console.log("run show post controller");

    res.send(`${req.params.id} Post`);
};