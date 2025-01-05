const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/connect'); 

class User extends Model {
  static associate(models) {
 
  }

  toJSON() {
    return { ...this.get(), password: undefined }; 
  }
}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      set(val) {
        if (val) this.setDataValue('name', val.trim());
      },
      validate: {
        len: {
          args: [1, 50],
          msg: 'Minimum 1 character required in name',
        },
      },
    },
    gender: {
      type: DataTypes.ENUM('m', 'f', 'o'),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please enter a valid email address',
        },
      },
    },
    mobile: {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: true,
      validate: {
        isMobile(value) {
          if (!/^\d{10}$/.test(value)) {
            throw new Error('Invalid mobile number');
          }
        },
      },
    },
    alternate_mobile: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: true,
      defaultValue: '1',
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    updated_by: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'user_master', 
    modelName: 'User',
    timestamps: true, 
  }
);
module.exports = User;
