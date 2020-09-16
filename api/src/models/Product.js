const {DataTypes} = require('sequelize');
const crypto = require('crypto');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = sequelize => {
	// defino el modelo
	const Product = sequelize.define('product', {
		titulo: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		descripcion: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		precio: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		stock: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		imagen: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
	const Cat = sequelize.define('cat', {
		titulo: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		descripcion: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	});
	const Carrito = sequelize.define('carrito', {
		estado: {
			type: DataTypes.ENUM('activo', 'cancelada', 'completa', 'despachada'),
		},
	});
	const User = sequelize.define('user', {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        apellido: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                return () => this.getDataValue('password');
            },
        },
        salt: {
            type: DataTypes.STRING,
            get() {
                return () => this.getDataValue('salt');
            },
        },
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        direccion: {
            type: DataTypes.STRING,
        },
        cp: {
            type: DataTypes.INTEGER,
        },
        ciudad : {
            type: DataTypes.STRING,
        },
        provincia: {
            type: DataTypes.STRING,
        },
    });

	const lineorder = sequelize.define('lineorder', {
		cantidad: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		precio: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	});

	const Review = sequelize.define('review', {
		descripcion: {
			type: DataTypes.TEXT,
		},
		rating: {
			type: DataTypes.ENUM('1', '2', '3', '4', '5'),
		},
	});

	Product.hasMany(Review);
	Review.belongsTo(User);
	User.hasMany(Carrito);
	Product.belongsToMany(Cat, {through: 'productcat'});
	Cat.belongsToMany(Product, {through: 'productcat'});
	Carrito.belongsToMany(Product, {through: lineorder});
	Product.belongsToMany(Carrito, {through: lineorder});

	User.generateSalt = function () {
		return crypto.randomBytes(16).toString('base64');
	};
	User.encryptPassword = function (plainText, salt) {
		return crypto.createHash('RSA-SHA256').update(plainText).update(salt).digest('hex');
	};
	const setSaltAndPassword = user => {
		if (user.changed('password')) {
			user.salt = User.generateSalt();
			user.password = User.encryptPassword(user.password(), user.salt());
		}
	};
	User.beforeCreate(setSaltAndPassword);
	User.beforeUpdate(setSaltAndPassword);

	User.prototype.correctPassword = function (enteredPassword) {
		return User.encryptPassword(enteredPassword, this.salt()) === this.password();
	};

};
