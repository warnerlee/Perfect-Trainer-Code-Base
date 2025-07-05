// controllers/UserController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");

class UserController {
    static async register(req, res) {
        try {
            const {
                email, password, passwordVerify,
                fName, lName, height, weight,
                gender, type, phoneNum
            } = req.body;

            // Required field validation
            if (!email || !password || !passwordVerify || !fName || !lName || !height || !weight || !gender || !type || !phoneNum) {
                return res.status(400).json({ errorMessage: "All fields are required." });
            }

            if (password.length < 6)
                return res.status(400).json({ errorMessage: "Password must be at least 6 characters." });

            if (password !== passwordVerify)
                return res.status(400).json({ errorMessage: "Make sure your passwords match." });

            // Basic format validation (extend as needed)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email))
                return res.status(400).json({ errorMessage: "Invalid email format." });

            if (isNaN(height) || height <= 0)
                return res.status(400).json({ errorMessage: "Height must be a positive number." });

            if (isNaN(weight) || weight <= 0)
                return res.status(400).json({ errorMessage: "Weight must be a positive number." });

            // Check if email is already used
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser)
                return res.status(400).json({ errorMessage: "This email is already associated with an account." });

            // Hash password
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);

            // Save user
            const newUser = await UserModel.create({
                email,
                passwordHash,
                fName,
                lName,
                height,
                weight,
                gender,
                type,
                phoneNum
            });

            // JWT & Cookie
            const token = jwt.sign({ user: newUser.id }, process.env.JWT_SECRET);
            res.cookie("token", token, { httpOnly: true }).send();

        } catch (err) {
            console.error(err);
            res.status(500).send();
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password)
                return res.status(400).json({ errorMessage: "Please enter the required fields." });

            const user = await UserModel.findByEmail(email);
            if (!user)
                return res.status(401).json({ errorMessage: "Wrong email or password." });

            const passwordCorrect = await bcrypt.compare(password, user.passwordhash); // lowercase field

            if (!passwordCorrect)
                return res.status(401).json({ errorMessage: "Wrong email or password." });

            const token = jwt.sign({ user: user.id }, process.env.JWT_SECRET);
            res.cookie("token", token, { httpOnly: true }).send();

        } catch (err) {
            console.error(err);
            res.status(500).send();
        }
    }

    static logout(req, res) {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0)
        }).send();
    }

    static loggedIn(req, res) {
        try {
            const token = req.cookies.token;
            if (!token) return res.json(false);

            jwt.verify(token, process.env.JWT_SECRET);
            res.send(true);
        } catch (err) {
            console.error(err);
            res.json(false);
        }
    }

    static test(req, res) {
        console.log("test");
        res.status(200).send();
    }
}

module.exports = UserController;