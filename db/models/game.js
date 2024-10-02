
module.exports  = (sequelize, type) => {
    return sequelize.define('Game', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      vendorId: {
        type: type.STRING,
      },
      Ios_bundleId: {
        type: type.STRING,
        description: type.STRING,
      },
      android_bundleId: {
        type: type.STRING,
        description: type.STRING,
      },
      ios_storeId: {
        type: type.STRING,
        description: type.STRING,
      },
      android_storeId: {
        type: type.STRING,
        description: type.STRING,
      },
      name: {
        type: type.STRING,
        description: type.STRING,
      },
      description: {
        type: type.STRING,
        description: type.STRING,
      },
      icon: {
        type: type.STRING,
        description: type.STRING,
      },
      plateform: {
        type: type.STRING,
        description: type.STRING,
      },
      engine: {
        type: type.STRING,
        description: type.STRING,
      },
      leaderboard: {
        type: type.BOOLEAN,
        description: type.BOOLEAN,
      },
      ios_certificate: {
        type: type.STRING,
        description: type.STRING,
      },
      android_certificate: {
        type: type.STRING,
        description: type.STRING,
      },
      ios_password: {
        type: type.STRING,
        description: type.STRING,
      },
      android_password: {
        type: type.STRING,
        description: type.STRING,
      },
      android_fcm: {
        type: type.STRING,
        description: type.STRING,
      },
      ios_authKey: {
        type: type.STRING,
        description: type.STRING,
      },
      currency: {
        type: type.STRING,
        description: type.STRING,
      },
      apiKey: {
        type: type.STRING,
        description: type.STRING,
      },


    })
  }


  