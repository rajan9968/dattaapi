// const UserModels = require("../Models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createAuth } = require('../Dao/authDao');
const e = require("express");
const db = require('../config/db');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Call DAO function (it already handles checking existing user & hashing)
        const result = await createAuth({ name, email, password });

        return res.status(result.status).json({
            success: result.success,
            message: result.message,
            data: result.data || null
        });

    } catch (error) {
        console.error("Error in signup controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const login = async (req, res) => {
    try {
        console.log("Login request body:", req.body);

        const { email, password } = req.body;
        const user = await db('users').where({ email }).first();

        if (!user) {
            return res.status(403).json({ message: "Invalid Email", success: false });
        }

        console.log("User found:", user);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Invalid Password", success: false });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing in environment variables");
        }

        const jwToken = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: "Login Successfully",
            success: true,
            token: jwToken,
            user: { id: user.id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error("Error in login controller:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        return res.status(500).json({
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            success: false
        });
    }
};


module.exports = {
    signup,
    login
}