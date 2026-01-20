import 'react-native-get-random-values';
import {S3Client} from "@aws-sdk/client-s3";
import {Upload} from "@aws-sdk/lib-storage";
import {getConfig} from "@/config";
import * as FileSystem from 'expo-file-system';
import {generateFileName, RNFile} from "@/utils/upload/utils";


// 为了解决 切换后台上传失败的问题
export const performSingleUpload = async (
    file: RNFile,
    onProgressChange?: (p: number) => void
): Promise<string> => {

    try {

        console.log('performSingleUpload', file);

        // // 获取文件内容
        // const response = await fetch((file as any).uri);
        // const blob = await response.blob();
        // console.log('blob', blob);

        const fileKey = await generateFileName(file as any)
        // 读取文件内容为 base64

        console.log('readAsStringAsync start', file);

        const fileContent = await FileSystem.readAsStringAsync(file.uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        console.log('readAsStringAsync end', file);
        // 转换为 Buffer
        // const buffer = Buffer.from(fileContent, 'base64');
        // 转换为 Uint8Array
        const uint8Array = new Uint8Array(
            atob(fileContent).split('').map(char => char.charCodeAt(0))
        );

        const upload = new Upload({
            client: new S3Client({
                region: getConfig().REGION,
                credentials: {
                    accessKeyId: getConfig().ACCESSKEY,
                    secretAccessKey: getConfig().ACCESSSECRET,
                },
            }),
            params: {
                Bucket: getConfig().BUCKET,
                Key: fileKey,
                Body: uint8Array,
                ACL: 'public-read',
            },
            queueSize: 1, // 并发分片数
            partSize: 5 * 1024 * 1024, // 每片5MB
            leavePartsOnError: false,
        });

        upload.on("httpUploadProgress", (progress) => {

            console.log('httpUploadProgress', progress);
            if (progress.total && onProgressChange) {
                const percent = Math.round(((progress.loaded || 0) / progress.total) * 100);
                onProgressChange(percent);
            }
        });

        const result = await upload.done();

        console.log('result', result);

        // 返回文件的 S3 URL
        return `${getConfig().ENDPOINT}/${fileKey}`;

    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
};
