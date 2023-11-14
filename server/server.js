const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const mongoose = require('mongoose');
const { authMiddleware } = require('./utils/auth.js'); // Adjust the path
const typeDefs = require('./Schemas/typeDefs.js');
const resolvers = require('./Schemas/resolvers.js');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
startServer().then(async () => {
  // Connect to the database
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Fav-Book-Finder', {
      useNewUrlParser: true,
    useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  });
