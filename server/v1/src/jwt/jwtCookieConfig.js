require('dotenv').config();
const RefreshTokenOpt = { 'name': 'jwt', 'options': { httpOnly: true, expiresIn: process.env.R_EXPIR_BY || '1h' } };
module.exports = RefreshTokenOpt