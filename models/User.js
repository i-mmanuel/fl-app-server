const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	phone_number: {
		type: String,
		unique: true,
	},
	date_of_birth: {
		type: String,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	membership_type: {
		type: String,
		membership_type: '',
	},
	email_confirmed: {
		type: Boolean,
		default: false,
	},
	center: {
		type: String,
		default: '',
	},
	profile_image: {
		type: String,
	},
	notification_token: {
		type: String,
	},
	account_created: { type: Date, default: Date.now() },
	account_confirmed: { type: Date },
});

userSchema.pre('save', function (next) {
	const user = this;

	if (!user.isModified('password')) {
		return next();
	}

	bcrypt.genSalt(10, (error, salt) => {
		if (error) {
			return next(error);
		}

		bcrypt.hash(user.password, salt, (error, hash) => {
			if (error) {
				return next(error);
			}

			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function (candidatePassword) {
	const user = this;

	return new Promise((resolve, reject) => {
		bcrypt.compare(candidatePassword, user.password, (error, isMatch) => {
			if (error) {
				return reject(error);
			}

			if (!isMatch) {
				return reject(false);
			}

			resolve(true);
		});
	});
};

mongoose.model('User', userSchema);
