require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

let persons = [
    {
      id: 1,
      name: "AH",
      number: "040"
    },
    {
      id: 2,
      name: "AL",
      number: "39"
    },
    {
      id: 3,
      name: "DA",
      number: "12"
    },
    {
      id: 4,
      name: "MP",
      number: "39"
    }
  ]

morgan.token('body', request => {
  return JSON.stringify(request.body)
})

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const cors = require('cors')

app.use(cors())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (!person) {
    response.status(404).end()
  }
  Person.findById(request.params.id)
  .then(person => {
    response.json(person)
  })
})
/* Tähän id-hakuun korjausta */

app.get('/api/info', (request, response) => {
  response.send(
    `
    <p>Phonebook has info for ${persons.length} people</p> 
    <p>${Date()}</p>
    `
    )
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })  
  }
  if (!body.number){
    return response.status(400).json({
      error: 'number missing'
    })
  }
  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number    
  })

  persons = persons.concat(person)
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)