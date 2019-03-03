const graphql = require('graphql');
const Book = require('../Models/Book');
const Author = require('../Models/Author');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLSchema
} = graphql;


const GraphQLBook = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    genre: {
      type: GraphQLString
    },
    author: {
      type: GraphQLAuthor,
      resolve(parent, args) {
        return Author.findById(parent.authorId)
      }
    }
  })
})

const GraphQLAuthor = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    age: {
      type: GraphQLInt
    },
    books: {
      type: new GraphQLList(GraphQLBook),
      resolve(parent, args) {
        return Book.find({
          authorId: parent.id
        })
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    book: {
      type: GraphQLBook,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: (root, {
        id
      }) => Book.findById(id)
    },
    booksNameLike: {
      type: new GraphQLList(GraphQLBook),
      args: {
        name: {
          type: GraphQLString
        }
      },
      resolve:(root, {name}) => Book.find({
          'name': new RegExp(`${name}`)
        })
    },
    author: {
      type: GraphQLAuthor,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: (root, {
        id
      }) => Author.findById(id)
    },
    books: {
      type: new GraphQLList(GraphQLBook),
      resolve: () => Book.find({})
    },
    authors: {
      type: new GraphQLList(GraphQLAuthor),
      resolve: () => Author.find({})
    }
  },
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: GraphQLAuthor,
      args: {
        name: {
          type: GraphQLString
        },
        age: {
          type: GraphQLInt
        }
      },
      resolve: (root, args) => new Author(args).save()
    }
  },
  addBook: {
    type: GraphQLBook,
    args: {
      name: {
        type: GraphQLString
      },
      genre: {
        type: GraphQLString
      },
      authorID: {
        type: GraphQLID
      }
    },
    resolve: (root, args) => new Book(args).save()
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})