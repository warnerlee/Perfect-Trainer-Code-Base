// controllers/UserController.js
const UserService = require("../Services/userService");

class UserController {
    static async register(req, res) {
        try {
            const newUser = await UserService.registerUser(req.body);
            // Generate JWT token
            const token = UserService.generateToken(newUser);
            // Set cookie and send response
            res.cookie("token", token, { httpOnly: true }).send();
        } catch (error) {
            console.error(error);
            // Handle specific validation errors
            if (error.message.includes("required") ||
                error.message.includes("password") ||
                error.message.includes("email") ||
                error.message.includes("Height") ||
                error.message.includes("Weight") ||
                error.message.includes("already associated")) {
                return res.status(400).json({ errorMessage: error.message });
            }
            // Handle server errors
            res.status(500).json({ errorMessage: "Internal server error" });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserService.loginUser(email, password);
            // Generate JWT token
            const token = UserService.generateToken(user);
            // Set cookie and send response
            res.cookie("token", token, { httpOnly: true }).send();
        } catch (error) {
            console.error(error);
            // Handle authentication errors
            if (error.message.includes("required") || error.message.includes("Wrong")) {
                return res.status(401).json({ errorMessage: error.message });
            }
            // Handle server errors
            res.status(500).json({ errorMessage: "Internal server error" });
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

            const isValid = UserService.isTokenValid(token);
            res.json(isValid);
        } catch (error) {
            console.error(error);
            res.json(false);
        }
    }

    static async updateUser(req, res) {
        try {
            const token = req.cookies.token;
            const updates = req.body;
            const result = await UserService.updateUser(token, updates);
            
            res.status(200).json({
                message: "User updated successfully",
                user: result
            });
        } catch (error) {
            console.error("Failed to update user: ", error);
            res.status(400).json({ errorMessage: error.message });
        }
    }

    static test(req, res) {
        console.log("test");
        res.status(200).send();
    }
}

module.exports = UserController;