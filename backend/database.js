require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://jainamshah0428:${process.env.db_password}@girlhackscluster.3r5xk.mongodb.net/?retryWrites=true&w=majority&appName=girlhackscluster`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connection() {
    try {
        await client.connect();
        const database = client.db("userprofilesDB");
        const collection = database.collection("users");
        return { database, collection };
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

async function insert(username, password, firstname, lastname, email) {
    const { collection } = await connection();
    
    const newUserProfile = {
        username: username,
        first_name: firstname,
        last_name: lastname,
        email: email,
        created: new Date()
    };

    const existingUser = await collection.findOne({ username: newUserProfile.username });
    const existingEmail = await collection.findOne({ email: newUserProfile.email });

    if (existingUser) {
        return "Username Already Exists";
    } else if (existingEmail) {
        return "Email already exists";
    } else {
        const result = await collection.insertOne(newUserProfile);
        return `New user profile created with the following id: ${result.insertedId}`;
    }
}



main();

   


// async function find(username) {
//     try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();

//     const database = client.db("userprofilesDB");
//     const collection = database.collection("users")

//     const newUserProfile = {

//         username: username,
//         first_name: firstname,
//         last_name: lastname,
//         email: email,
//         created: new Date()
//     };

//     const existingUser = await collection.findOne({ username: newUserProfile.username });
//     const existingEmail = await collection.findOne({ email: newUserProfile.email})

//     if (existingUser){
//         return "Username Already Exists"
//     }
//     else if(existingEmail){
//         return "Email already exists"
//     }
//     else{
//         const result = await collection.insertOne(newUserProfile);
//         return `New user profile created with the following id: ${result.insertedId}`;
//     }
//     // Send a ping to confirm a successful connection
//     }
//     catch(error){
//         console.error("Error connecting to MongoDB:", error);
//     }
//     finally{
//         await client.close();
//     }
   
// }

// await client.db("admin").command({ ping: 1 });
// console.log("Pinged your deployment. You successfully connected to MongoDB!");
// await db.collection('c').insertOne({
//     item: 'canvas',
//     qty: 100,
//     tags: ['cotton'],
//     size: { h: 28, w: 35.5, uom: 'cm' }
//   });
// } finally {
// // Ensures that the client will close when you finish/error
// await client.close();
