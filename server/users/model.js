let Mongoose = require('mongoose')
let Schema = Mongoose.Schema
let MongoosePaginate = require('mongoose-paginate')
let Bcrypt = require('bcrypt')

// https://gist.github.com/dmh2000/1609820c17c5daf95298f54324360950

const SALT_WORK_FACTOR = 10

// Campos do schema do usuario

const User = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true, lowercase: true},
  password: {type: String, required: true},
  active: {type: Boolean, required: true, default: true},
  is_admin: {type: Boolean, required: true, default: false},
  is_superuser: {type: Boolean, required: true, default: false},
  created: {type: Date},
  updated: {type: Date, default: Date.now}
})

User.pre(
  'save',
  function (next) {
    // busca a data atual
    let currentDate = new Date()

    // seta o usuario para o escopo atual
    let user = this

    // seta o campo updated para a data atual
    user.updated = currentDate

    // se não existir uma data de criado entao seta a data atual
    if (!user.created) {
      user.created = currentDate
    }

    // verifica se o campo password nao foi modificado
    if (!user.isModified('password')) {
      return next()
    }

    // gera o brypt de acordo com o salt

    Bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) {
        return next(err)
      }

      // gera o hash de acordo com a senha e o salt gerado
      Bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err)
        }

        user.password = hash
        next()
      })
    })
  }
)

// seta o plugin de paginação
User.plugin(MongoosePaginate)

module.exports = Mongoose.model('User', User)
