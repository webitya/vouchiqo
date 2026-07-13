import { MongoClient } from "mongodb";

const MONGODB_URI = "mongodb+srv://vouchiqo_db_user:PhK1RD8hruMuQGps@vochiqo.xezl8ja.mongodb.net/vouchiqo";

async function run() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const users = await db.collection("user").find({}).toArray();
    console.log("Users currently in DB:");
    users.forEach(u => {
      console.log(`- email: ${u.email}, role: ${u.role}`);
    });
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

run();
