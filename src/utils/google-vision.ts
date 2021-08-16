import axios from 'axios';

interface response {
    result: any
    success: boolean

}

export const postGoogleTextDetectionForCheck = async (dataUrl, googleApiKey): Promise<response> => {
    dataUrl = dataUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
   
    try {
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        const body = JSON.stringify({
            requests: [
                {
                    image: {
                        content: dataUrl,
                    },
                    features: [
                        {
                            maxResults: 50,
                            type: "DOCUMENT_TEXT_DETECTION",
                        },
                    ],
                },
            ],
        });

        const resp = await axios
            .post(
                "https://vision.googleapis.com/v1/images:annotate?key=" + googleApiKey,
                body,
                {
                    headers,
                }
            );

        if (resp.status == 200) {
            let result =
                resp.data.responses.length > 0 ? resp.data.responses[0] : null;
            if (result.textAnnotations != null) {
                result = result.textAnnotations;
            }
            let response = {
                success: true,
                result,
            };

            return response;
        } else {
            let response = {
                success: false,
                result: []
            };
            return response;
        }
    } catch (err) {
        console.log(err)
    }


}

export const postGoogleLogoDetectionForCheck = async (dataUrl, googleApiKey): Promise<response> => {
    dataUrl = dataUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
   
    try {
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        const body = JSON.stringify({
            requests: [
                {
                    image: {
                        content: dataUrl,
                    },
                    features: [
                        {
                            maxResults: 50,
                            type: "LOGO_DETECTION",
                        },
                    ],
                },
            ],
        });

        const resp = await axios
            .post(
                "https://vision.googleapis.com/v1/images:annotate?key=" + googleApiKey,
                body,
                {
                    headers,
                }
            );

        if (resp.status == 200) {
            let result =
                resp.data.responses.length > 0 ? resp.data.responses[0] : null;
            if (result.logoAnnotations != null) {
                result = result.logoAnnotations;
            }
            let response = {
                success: true,
                result,
            };

            return response;
        } else {
            let response = {
                success: false,
                result: []
            };
            return response;
        }
    } catch (err) {
        console.log(err)
    }


}



