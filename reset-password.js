const crypto = require('crypto');

const password = process.argv[2] || 'NewPassword123'; // Change this!
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.scryptSync(password, salt, 64).toString('hex');
const passwordHash = `scrypt:${salt}:${hash}`;

console.log('Password Hash:');
console.log(passwordHash);
