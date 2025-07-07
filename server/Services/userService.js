// services/UserService.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");

class UserService {
    // Validation methods
    static validateRequiredFields(userData, requiredFields) {
        const missingFields = [];
        
        for (const field of requiredFields) {
            if (!userData[field] || (typeof userData[field] === 'string' && userData[field].trim() === '')) {
                missingFields.push(field);
            }
        }
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
    }

    static validateEmail(email) {
        if (!email) return; // Skip if not provided (for updates)
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format.");
        }
    }

    static validatePassword(password, passwordVerify = null) {
        if (!password) return; // Skip if not provided (for updates)
        
        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters.");
        }

        if (passwordVerify !== null && password !== passwordVerify) {
            throw new Error("Make sure your passwords match.");
        }
    }

    static validateName(name, fieldName) {
        if (!name) return; // Skip if not provided (for updates)
        
        if (typeof name !== 'string' || name.trim().length === 0) {
            throw new Error(`${fieldName} must be a non-empty string.`);
        }
        
        if (name.length > 50) {
            throw new Error(`${fieldName} must be 50 characters or less.`);
        }
    }

    static validateHeight(height) {
        if (height === undefined || height === null || height === '') return; // Skip if not provided
        
        const numHeight = Number(height);
        if (isNaN(numHeight) || numHeight <= 0) {
            throw new Error("Height must be a positive number.");
        }
        
        if (numHeight > 300) { // Reasonable upper limit in cm
            throw new Error("Height must be a realistic value.");
        }
    }

    static validateWeight(weight) {
        if (weight === undefined || weight === null || weight === '') return; // Skip if not provided
        
        const numWeight = Number(weight);
        if (isNaN(numWeight) || numWeight <= 0) {
            throw new Error("Weight must be a positive number.");
        }
        
        if (numWeight > 1000) { // Reasonable upper limit in kg
            throw new Error("Weight must be a realistic value.");
        }
    }

    static validateGender(gender) {
        if (!gender) return; // Skip if not provided (for updates)
        
        const validGenders = ['Male', 'Female', 'Other'];
        if (!validGenders.includes(gender)) {
            throw new Error("Gender must be one of: Male, Female, Other");
        }
    }

    static validateType(type) {
        if (!type) return; // Skip if not provided (for updates)
        
        const validTypes = ['Client', 'Trainer', 'Admin'];
        if (!validTypes.includes(type)) {
            throw new Error("Type must be one of: Client, Trainer, Admin");
        }
    }

    static validatePhoneNumber(phoneNum) {
        if (!phoneNum) return; // Skip if not provided (for updates)
        
        // Basic phone number validation (adjust regex as needed for your requirements)
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phoneNum.replace(/[\s\-\(\)]/g, ''))) {
            throw new Error("Invalid phone number format.");
        }
    }

    static validateUserData(userData, isUpdate = false) {
        const {
            email, password, passwordVerify,
            fName, lName, height, weight,
            gender, type, phoneNum
        } = userData;

        // For registration, all fields are required
        if (!isUpdate) {
            this.validateRequiredFields(userData, [
                'email', 'password', 'passwordVerify', 'fName', 'lName',
                'height', 'weight', 'gender', 'type', 'phoneNum'
            ]);
        }

        // Individual field validation
        this.validateEmail(email);
        this.validatePassword(password, passwordVerify);
        this.validateName(fName, 'First name');
        this.validateName(lName, 'Last name');
        this.validateHeight(height);
        this.validateWeight(weight);
        this.validateGender(gender);
        this.validateType(type);
        this.validatePhoneNumber(phoneNum);
    }

    static async registerUser(userData) {
        // Validate all user data
        this.validateUserData(userData, false);

        // Check if email is already used
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            throw new Error("This email is already associated with an account.");
        }

        let status = "Active";
        // Check type and set status accordingly
        if (type === "Trainer") {
            status = "Pending";
        }

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
            phoneNum,
            status
        });

        return newUser;
    }

    static async loginUser(email, password) {
        if (!email || !password) {
            throw new Error("Please enter the required fields.");
        }

        const user = await UserModel.findByEmail(email);
        if (!user) {
            throw new Error("Wrong email or password.");
        }

        const passwordCorrect = await bcrypt.compare(password, user.passwordhash);
        if (!passwordCorrect) {
            throw new Error("Wrong email or password.");
        }

        return user;
    }

    static generateToken(user) {
        return jwt.sign(user, process.env.JWT_SECRET);
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error("Invalid token");
        }
    }

    static async updateUser(token, updates) {
        try {
            const decoded = this.verifyToken(token);
            // Validate update data (partial validation for updates)
            this.validateUserData(updates, true);
            // If email is being updated, check if it's already in use
            if (updates.email) {
                const existingUser = await UserModel.findByEmail(updates.email);//this needs to be changed to findby id using the id from the decoded jwt
                if (existingUser && existingUser.id !== decoded.id) {
                    throw new Error("This email is already associated with another account.");
                }
            }
            // If password is being updated, hash it
            if (updates.password) {
                const salt = await bcrypt.genSalt();
                updates.passwordHash = await bcrypt.hash(updates.password, salt);
                // Remove plain text password from updates
                delete updates.password;
                delete updates.passwordVerify;
            }
            
            // If type is being changed to Trainer, set status to Pending
            if (updates.type === "Trainer") {
                updates.status = "Pending";
            }
            
            // Add your update logic here
            // For example:
            // const updatedUser = await UserModel.updateById(decoded.id, updates);
            // return updatedUser;
            
            console.log("Updates to be applied:", updates);
            // Return the decoded user for now until update logic is implemented
            return { ...decoded, ...updates };
        } catch (error) {
            throw new Error("Failed to update user: " + error.message);
        }
    }

    static isTokenValid(token) {
        try {
            this.verifyToken(token);
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = UserService;