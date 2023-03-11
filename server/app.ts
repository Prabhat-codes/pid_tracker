import express from 'express'
import cors from 'cors'
import multer from 'multer'

import fileController from './controllers/FileController'

const app = express()
const upload = multer()
app.use(express.json())
app.use(cors({
    exposedHeaders: ['Content-Disposition']
}))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/files', require('./routes/files'))
app.use('/api/developer', require('./routes/developer'))
app.use('/api/reviewer', require('./routes/reviewer'))
app.post('/uploadFile', upload.single('file'), fileController.uploadFile)
app.get('/getFiles', upload.none(), fileController.getFiles)
app.get('/downloadFile/:id', upload.none(), fileController.downloadFile)

app.listen(5000, () => console.log('server is running'))

export default app