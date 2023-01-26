import express from 'express'
const app = express()
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import expRoutes from './routes/expRoutes.js'
import resRoutes from './routes/resRoute.js'
import cors from 'cors'
dotenv.config()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api',userRoutes)
app.use('/api',expRoutes)
app.use('/api',resRoutes)
mongoose.set('strictQuery', true)
mongoose.connect(process.env.DB_URL).then(
    app.listen(8000, () => {
        console.log("Server Connected on 8000")
    })
).catch((err) => {
    console.log("ERROR:", err)
})


