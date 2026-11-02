const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

async function test() {
  console.log('Starting MongoMemoryServer...');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log('MongoMemoryServer started at:', uri);
  await mongoose.connect(uri);
  console.log('Mongoose connected successfully to in-memory MongoDB!');
  const testSchema = new mongoose.Schema({ name: String });
  const Test = mongoose.model('Test', testSchema);
  const doc = await Test.create({ name: 'ACE Student' });
  console.log('Created real MongoDB document:', doc);
  await mongoose.disconnect();
  await mongod.stop();
  console.log('MongoMemoryServer stopped cleanly.');
}

test().catch(console.error);

