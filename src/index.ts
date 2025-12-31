import QRCode from 'qrcode';
import { readBarcodes } from 'zxing-wasm/reader';

export const tools = [
    {
        type: 'function' as const,
        function: {
            name: 'readQR',
            description: 'Take the Cache Key of a Base64 image string as input, and output its decoded content',
            parameters: {
                type: 'object',
                properties: {
                    qrimg: {
                        type: 'string',
                        description: 'Cache Key of the encoded Base64 image string (input)',
                    }
                },
                required: ['qrimg']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'writeQR',
            description: 'Take as input a string to be encoded in QR, and output the Cache Key of the encoded Base64 image string',
            parameters: {
                type: 'object',
                properties: {
                    input: {
                        type: 'string',
                        description: 'String to be encoded',
                    }
                },
                required: ['input']
            }
        }
    },
];

export const functions = {
    readQR: async (params: any, additionalArgs: any): Promise<string> => {
        const { aicache } = additionalArgs;
        const { qrimg } = params;
        const buffer = Buffer.from(aicache.get(qrimg), 'base64');
        const output = await readBarcodes(buffer);
        if(!output[0]){
            throw new Error('output[0] is undefined');
        }
        return output[0].text;
    },
    writeQR: async (params: any, additionalArgs: any): Promise<string> => {
        const { aicache } = additionalArgs;
        const { input } = params;
        const buffer = await QRCode.toBuffer(input);
        const key = aicache.set(buffer.toString('base64'));
        return key;
    },
};
