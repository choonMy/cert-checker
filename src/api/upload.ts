import { Router } from 'express'
import logger from '../loaders/logger'
import { success } from '../utils/api-response'
import validationMiddleware from '../middlewares/validation'
import RecognizerService from '../services/recognizer.service'


import multer from 'multer'
import HttpException from '../exceptions/HttpException'

const googleRecognizerService = new RecognizerService()
const path = require('path')
const rootPath = require('path').resolve('./')

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "upload");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `cert-${file.fieldname}-${Date.now()}.${ext}`);
    },
});

//Calling the "multer" Function
const upload = multer({
    storage: multerStorage
});
const router = Router()

router.get('/file/:fileName(*)', (req, res) => {
    const filePath = path.join(rootPath, req.params.fileName); // find out the filePath based on given file name
    res.sendFile(filePath);
})


router.post('/cert', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file)
            throw new HttpException(400, "File not found")

        let fileObj = {
            originalname: req.file.originalname,
            encoding: req.file.encoding,
            mimetype: req.file.mimetype,
            destination: req.file.destination,
            filename: req.file.filename,
            path: req.file.path,
            //Size of the file in bytes
            size: req.file.size
        }

        logger.info(fileObj.filename)

        const textResult: {} = await googleRecognizerService.performVisionTextRecognise(fileObj.filename)
        const logoResult: {} = await googleRecognizerService.performVisionLogoRecognise(fileObj.filename)

        res.json(success('OK', { data: { ...textResult, ...logoResult } }, 200))
    } catch (e) {
        logger.error('🔥 error %o', e);
        next(e);

    }
})


export = router