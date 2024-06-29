require('dotenv').config();
const RefreshTokenOpt = { 'name': 'jwt', 'options': { httpOnly: true, expiresIn: process.env.EXPIR_BY } };
module.exports = RefreshTokenOpt