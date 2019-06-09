const secret = "AmrWali_Project",
    Jwt_expireTime = "1hr";


const mongoose = require('mongoose'),
    options = { discriminatorKey: 'kind' },
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken');

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "name can't be empty"
    },
    email: {
        type: String,
        required: "Email can't be empty",
    },
    password: {
        type: String,
        required: "Password can't be empty",
        minlength: [6, 'Password must be atleast 6 character long']
    },
    phone: {
        type: Number
    },
    saltSecret: String
}, options);

userSchema.index({ email: 1, kind: 1 }, { unique: true });

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,13}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

// Events
userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});

// Methods
userSchema.methods.generateJwt = function () {
    return jwt.sign(
        {
            _id: this._id
        }, secret,
        {
            expiresIn: Jwt_expireTime
        }
    );
}

userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

const User = mongoose.model('User', userSchema);
module.exports = User;