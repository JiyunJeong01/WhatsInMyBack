exports.showPost = (req, res) => {
    console.log("run show post controller");

    res.send(`${req.params.id} Post`);  //메인 변경
};