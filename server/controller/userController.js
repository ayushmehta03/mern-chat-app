const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Trim inputs
        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim().toLowerCase();

        // Check if username already exists
        const usernameCheck = await User.findOne({ username: trimmedUsername });
        if (usernameCheck) {
            return res.status(400).json({ msg: "Username already exists", status: false });
        }

        // Check if email already exists
        const mailCheck = await User.findOne({ email: trimmedEmail });
        if (mailCheck) {
            return res.status(400).json({ msg: "Email already exists", status: false });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email: trimmedEmail,
            username: trimmedUsername,
            password: hashPassword,
        });

        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.password;

        return res.status(201).json({ status: true, user: userWithoutPassword });

    } catch (ex) {
        return next(ex);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Trim username
        const trimmedUsername = username.trim();

        // Find user
        const user = await User.findOne({ username: trimmedUsername });
        if (!user) {
            return res.status(400).json({ msg: "Incorrect Username or Password", status: false });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: "Incorrect Username or Password", status: false });
        }

        // Remove password before sending response
        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.password;

        return res.status(200).json({ status: true, user: userWithoutPassword });

    } catch (ex) {
        return next(ex);
    }
}

    module.exports.setAvatar= async(req,res,next)=>{
        try{
            const userId= req.params.id;
            const avatarImage= req.body.image;
            const userData=  await User.findByIdAndUpdate(userId,{
                isAvatarImageSet:true,
                avatarImage,
            });
            return res.json({isSet:
                userData.isAvatarImageSet,
                image:userData.avatarImage})

        }
        catch(ex){
            next(ex);
        }
    }
    module.exports.getAllUsers= async(req,res,next)=>{
        try{
            const users= await User.find({_id:{$ne:req.params.id}}).select([
                "email",
                "username",
                "avatarImage",
                "_id"
            ]);
            return res.json(users);

        }
        catch(ex){
            next(ex);
        }
    }

