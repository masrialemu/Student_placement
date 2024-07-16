const mongoose = require('mongoose');

async function deleteAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.deleteMany();
      console.log(`Successfully deleted all documents in the collection: ${collectionName}`);
    } catch (error) {
      console.error(`Error deleting collection ${collectionName}:`, error);
      throw error;  // Re-throw the error to be caught in the route handler
    }
  }
}

module.exports = deleteAllCollections;
