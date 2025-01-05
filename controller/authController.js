const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const AppError = require('../utils/appError');
const sequelize = require('../database/connect'); 
const { QueryTypes } = require('sequelize');
const catchAsync = require('../utils/catchAsync');



exports.createUser = catchAsync(async (req, res, next) => {

    const { title,
        first_name,
        last_name,
        gender,
        email,
        mobile,
        alternate_mobile,
        password,
        status
    } = req.body;

    if (!first_name || first_name.trim() === "") {
        return next(new AppError('Please provide first_name', 400));
    }

    if (!email || email.trim() === "") {
        return next(new AppError('Please provide Email', 400));
    }

    if (!mobile || mobile.trim() === "") {
        return next(new AppError('Please provide Mobile Number', 400));
    }

    if (!password) {
        return next(new AppError('Please provide Password', 400));
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return next(new AppError('Email is already in use', 400));
    }

    const existingEmailUser = await User.findOne({ where: { email } });
    if (existingEmailUser) {
        return next(new AppError('Email is already in use', 400));
    }

    const existingMobileUser = await User.findOne({ where: { mobile } });
    if (existingMobileUser) {
        return next(new AppError('Mobile number is already in use', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const fullName = first_name.trim() + (last_name ? ' ' + last_name.trim() : '');
    const userData = await User.create({
        title,
        first_name,
        last_name,
        gender,
        name: fullName,
        email,
        mobile,
        alternate_mobile,
        password: hashedPassword,
        status: status ? status : "1"
    });

    return res.status(200).json({
        status: 'success',
        message: 'User registered successfully.',
        data: {
            user: {
                user_id: userData.user_id,
                name: userData.name,
                email: userData.email,
                mobile: userData.mobile,
            },
        },
    });

});

// api to get user 


exports.getUser = catchAsync(async (req, res, next) => {
    const query = `SELECT name, gender, mobile, email FROM user_master`;

    const [result] = await sequelize.query(query, {
        type: QueryTypes.SELECT, 
    });

    return res.status(200).json({
        status: 'success',
        message: 'Data fetched successfully.',
        data: result,
    });
});


// api for user login 


exports.userLogin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email && !password)
        return next(new AppError('Email or password missing', 400));

        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return next(new AppError('No user found with the given Email', 400));
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return next(new AppError('Invalid credentials', 401));
        }

        const token = jwt.sign(
            { userId: existingUser.user_id, email: existingUser.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            status: 'success',
            message: 'User logged in successfully.',
            data: {
                user: {
                    user_id: existingUser.user_id,
                    name: existingUser.name,
                    email: existingUser.email,
                    mobile: existingUser.mobile,
                },
               
            },
        });
});

