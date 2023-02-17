import express from 'express'
import cors from 'cors'
import multer from 'multer'

import fileController from './controllers/FileController'

const app = express()
const upload = multer()
app.use(express.json())
app.use(cors())
app.use('/api/auth', require('./routes/auth'))
app.post('/uploadFile', upload.single('file'), fileController.uploadFile)

app.listen(5000, () => console.log('server is running'))