import experss from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import conectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'

// App Config
const app = experss()
const port = process.env.PORT || 4000
connectDB()
conectCloudinary()

// middleware
app.use(experss.json())
app.use(cors())

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)

app.get('/', (req, res) => {
  res.send("API Working")
})  

app.listen(port, () => console.log(`Server started on PORT : ${port}`))