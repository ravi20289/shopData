const User = require('../models/user');
console.log("user is:", User)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const AppError = require('../utils/appError');
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

    const token = jwt.sign(
        { userId: userData.user_id, email: userData.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1d' }
    );

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
            token,
        },
    });

});
