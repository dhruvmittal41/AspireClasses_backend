const bcrypt = require('bcryptjs');

// The higher the number, the more secure the hash, but the longer it takes. 10 is a good default.
const saltRounds = 10;
const passwordToHash = 'AspireBoys'; // <-- Replace with your desired password

bcrypt.hash(passwordToHash, saltRounds, function (err, hash) {
    if (err) {
        console.error("Error hashing password:", err);
        return;
    }
    console.log("Your Hashed Password is:");
    console.log(hash);
    console.log("\nCopy this hash into your .env file.");
});