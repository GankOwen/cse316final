const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')
//const { updateUserById } = require('../../client/src/api')

getLoggedIn = async (req, res) => {
    console.log("123",loggedInUser);
    auth.verify(req, res, async function () {
        const loggedInUser = await User.findOne({ _id: req.userId });
        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email,
                id: loggedInUser._id
            }
        }).send();
    })
}

getUserById = async (req, res) => {
    console.log("4444")
    await User.findById({ _id: req.params.id }, (err, User) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        return res.status(200).json({ success: true, returnUser : User })
    }).catch(err => console.log(err))
}

updateUserById = async (req,res) =>{
    
    const body = req.body
    console.log("updateUser: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    User.findOne({ _id: req.params.id }, (err, user) => {
        console.log("User found: " + JSON.stringify(user));
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!',
            })
        }

        user.likeLists = body.likeLists
        user.dislikeLists = body.dislikeLists

        console.log("body1111",body)

        user
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: user._id,
                    message: 'User updated!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'User not updated!',
                })
            })
    })

}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify } = req.body;
        console.log(req.body)
        
        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            
            return res
                .status(201)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            
            return res
                .status(201)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            
            return res
                .status(201)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(201)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, lastName, email, passwordHash
        });
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser);
        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                likeLists : savedUser.likeLists,
                dislikeLists : savedUser.dislikeLists 
            }
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}
// passing user data inform
    // email, password
    // find user with that user(find function)
    // if cannot find, return not exist user
    // if can find, compare the password
    // piazza bitcyph plaint password
    // if match the password return user and set the user auth (200) 
    logInUser = async (req, res) => {
        console.log("1234")
        try {
            const {email, password} = req.body;
            if (!email || !password) {
                return res
                    .status(201)
                    .json({ errorMessage: "Please enter all required fields." });
            }
            if (password.length < 8) {
                return res
                    .status(201)
                    .json({
                        errorMessage: "Please enter a password of at least 8 characters."
                    });
            }

            const existingUser = await User.findOne({ email: email });
            if (!existingUser) {
                return res
                    .status(201)
                    .json({
                        success: false,
                        errorMessage: "The account does not exist"
                    });
            }
            var passwordCheck = await bcrypt.compare(password,existingUser.passwordHash);
            
            if(!passwordCheck){
                return res
                    .status(201)
                    .json({
                        success: false,
                        errorMessage: "Wrong Password"
                    });
            }
    
            // LOGIN THE USER
            const token = auth.signToken(existingUser);
            console.log(existingUser);
            await res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            }).status(200).json({
                success: true,
                user: {
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    email: existingUser.email,
                    id: existingUser._id
                }
            }).send();
        } catch (err) {
            res.status(500).send();
        }
    }
module.exports = {
    getLoggedIn,
    registerUser,
    logInUser,
    updateUserById,
    getUserById
}