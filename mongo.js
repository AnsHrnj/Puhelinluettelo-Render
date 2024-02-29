const mongoose = require('mongoose')

if (process.argv.length < 5) {
  console.log('give password, name and number as arguments')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://AnsHrnj:${password}@fullstackreact.j1hafml.mongodb.net/PuhelinluetteloApp?retryWrites=true&w=majority&appName=FullstackReact`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: 'testinimi',
  number: 0,
})

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})