const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

router.get("/", async (req, res) => {
    console.log("test");
    res.status(200).send();
});

//Register
router.post("/", async (req, res) => {
    try {
        const { email, password, passwordVerify } = req.body;

        //validation
        if (!email || !password || !passwordVerify)
            return res
                .status(400)
                .json({errorMessage: "Please enter the required fields."});

        if (password.length < 6)
            return res
                .status(400)
                .json({errorMessage: "Password must be at least 6 characters."});

        if (password != passwordVerify)
            return res
                .status(400)
                .json({errorMessage: "Make sure your passwords match."});

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser)
            return res
                .status(400)
                .json({errorMessage: "This email is already associated with an account."});

        //hash password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // create user
        const savedUser = await prisma.user.create({
            data: {
                email,
                passwordHash
            }
        });

        //login
        const token = jwt.sign({
            user: savedUser.id  // Note: Prisma uses 'id' not '_id'
        }, process.env.JWT_SECRET);

        //send http only cookie
        res
            .cookie("token", token, {
                httpOnly: true,
            })
            .send();
    }
    catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

//Login
router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

         //validation
        if (!email || !password)
            return res
                .status(400)
                .json({errorMessage: "Please enter the required fields."});

        // Find user by email
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (!existingUser)
            return res
                .status(401)
                .json({errorMessage: "Wrong email or password."});

        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);

        if (!passwordCorrect)
            return res
                .status(401)
                .json({errorMessage: "Wrong email or password."});

         //login
         const token = jwt.sign({
            user: existingUser.id,  // Note: Prisma uses 'id' not '_id'
        },
        process.env.JWT_SECRET);

        //send http only cookie
        res
            .cookie("token", token, {
                httpOnly: true,
            })
            .send();

    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

//Logout
router.get("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    })
    .send();
});

router.get("/loggedIn", (req, res) => {
     try {
            const token = req.cookies.token;
            if (!token) return res.json(false);

            jwt.verify(token, process.env.JWT_SECRET);

            res.send(true);
        } catch (err) {
            console.error(err);
            res.json(false);
        }
});

module.exports = router;