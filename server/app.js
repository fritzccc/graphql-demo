const express = require('express');
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const Book = require('./Models/Book')
const app = express();

mongoose.connect('mongodb://fritz:mlab123@ds153814.mlab.com:53814/gql', { useNewUrlParser: true })
mongoose.connection.once('open', () => {
  console.log('connected to mongoDB...')
})

//use graphqlHTTP as middleware to handle '/graphgl'
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

app.listen(4000, () => console.log('express is listening port 4000'))