const mongoose = require('mongoose')

const connectDB =async ()=>{
await mongoose.connect('mongodb+srv://2004mayankgoyal:khj47DnaHztqSyLZ@cluster.ruiqmpa.mongodb.net/devTender')
}

module.exports = connectDB



