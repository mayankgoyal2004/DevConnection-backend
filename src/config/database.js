const mongoose = require('mongoose')

const connectDB =async ()=>{
await mongoose.connect(process.env.DB_connection)
}

module.exports = connectDB



