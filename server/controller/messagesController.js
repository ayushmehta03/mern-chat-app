const messagemodel = require("../model/messagemodel");

module.exports.addMsg = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;

        const data = await messagemodel.create({
            message: { text: message },
            users: [from, to], // should be an array
            sender: from,
        });

        if (data) return res.json({ msg: "Message Added successfully" });
        return res.json({ msg: "Failed to add message" });
    } catch (ex) {
        next(ex);
    }
};

module.exports.getAllMsg = async (req, res, next) => {
    try {
        const { from, to } = req.body;

        const messages = await messagemodel.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 }); // `updatedAt` is from timestamps

        const projectMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
        });

        res.json(projectMessages);
    } catch (ex) {
        next(ex);
    }
};
