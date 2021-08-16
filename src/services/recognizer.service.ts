import { postGoogleTextDetectionForCheck, postGoogleLogoDetectionForCheck } from '../utils/google-vision';
import fs from "fs";
import logger from '../loaders/logger'
import config from '../config';

const path = require('path');
const rootPath = require('path').resolve('./')


export default class RecognizerService {

    public constructor() { }

    public async performVisionTextRecognise(fileName: string) {
        return new Promise(async (resolve, reject) => {
            const filePath = path.join(rootPath, "upload/", fileName);
            logger.info(filePath)

            const base64ImgData = this.base64_encode(filePath);
            const resp = await postGoogleTextDetectionForCheck(base64ImgData, config.googleApiKey);
            logger.info(JSON.stringify(resp.result));
            if (resp.success) {
                let dataStream = []
                let icNumber = ""

                resp.result.map(data => {
                    dataStream.push(data.description.trim())
                    if (data.description.trim().match(/^(\d{6})-(\d{2})-(\d{4})/)) {
                        icNumber = data.description.trim();
                    }
                })

                let hasFirstTitle = dataStream[0].match("COVID-19 Vaccination") == "COVID-19 Vaccination"

                let hasSecondTitle = dataStream[0].match("Digital Certificate") == "Digital Certificate"

                let hasFirstDoseMark = dataStream[0].match("Dose 1") == "Dose 1"

                let hasSecondDoseMark = dataStream[0].match("Dose 2") == "Dose 2"

                resolve({
                    icNumber, hasFirstTitle, hasSecondTitle, hasFirstDoseMark, hasSecondDoseMark
                })

            }
            reject("invalid response")

        })
    }

    public async performVisionLogoRecognise(fileName: string) {
        return new Promise(async (resolve, reject) => {
            const filePath = path.join(rootPath, "upload/", fileName);


            const base64ImgData = this.base64_encode(filePath);
            const resp = await postGoogleLogoDetectionForCheck(base64ImgData, config.googleApiKey);

            if (resp.success) {
                let dataStream = []

                resp.result.map(data => {
                    dataStream.push(data.description.trim())
                })

                const hasMalaysiaLogo = dataStream[0].match("Malaysia") == "Malaysia"

                resolve({
                    hasMalaysiaLogo
                })

            }
            reject("invalid response")
        })
    }

    private base64_encode(file) {
        var bitmap = fs.readFileSync(file);
        return new Buffer(bitmap).toString('base64');
    }

}