const UserModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const uuid  = require('uuid');
const mailService = require('.//mailService');
const tokenService = require('.//tokenService');
const UserDto = require('../dtos/UserDto');
const ApiError = require('../exceptions/apiError');

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email});

        if(candidate) {
            throw ApiError.BadRequest(`User: ${candidate.email} already exists`);
        }


        const hashedPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        const user = await UserModel.create({email, password: hashedPassword, activationLink});

        const activationURL = `${process.env.API_URL}/auth/activate/${activationLink}`;
        await mailService.sendActivationMail(email, activationURL);

        const userDto = new UserDto(user);

        const tokens = tokenService.generateToken({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink});
        if(!user) {
            throw ApiError.BadRequest(`Activation link incorrect: ${activationLink} `);
        }

        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({email});
        if(!user) {
            throw ApiError.BadRequest(`User: ${email} is not registered.`);
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if(!isPassEqual) {
            throw ApiError.BadRequest(`User: ${user.email} passwords don't match.`);
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokneFromDB = await tokenService.findToken(refreshToken);

        if(!tokneFromDB || !userData) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }
}

module.exports = new UserService();