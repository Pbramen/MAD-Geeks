function test1(req, res) { 
    return res.status(200).json({ status: 200 });
}

module.exports = {test1}