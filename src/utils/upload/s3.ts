import 'react-native-get-random-values';
import {PutObjectCommand, S3Client, S3ClientConfig,} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {generateFileName, uploadWithProgressV2} from "@/utils/upload/utils";
import {getConfig} from "@/config";
import {Alert} from "react-native";
import * as FileSystem from "expo-file-system";
import RNFS from "react-native-blob-util";


const s3Config: S3ClientConfig = {
    region: getConfig().REGION,
    credentials: {
        accessKeyId: getConfig().ACCESSKEY,
        secretAccessKey: getConfig().ACCESSSECRET,
    },
    forcePathStyle: true,
};

const getS3Client = (): any => {

    try {
        return new S3Client(s3Config)
    } catch (e) {
        Alert.alert("getS3Client err", JSON.stringify({
            error: e,
            s3Config
        }));
    }

}


export const S3_BUCKET = getConfig().BUCKET;

export const performSingleUpload = async (file: File, onProgressChange?: (p: number) => void): Promise<string> => {
    try {
        onProgressChange?.(0);

        console.log('generateFileName start', file.size);

        const filename = await generateFileName(file);

        console.log('generateFileName end', file.size);


        const putObjectCommand = new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: filename,
            ContentType: file.type,
            ACL: 'public-read',
        });

        const presignedUrl = await getSignedUrl(getS3Client(), putObjectCommand, {
            expiresIn: 3600,
        });

        console.log('presignedUrl', presignedUrl);

        // // 获取文件内容
        // const response = await fetch((file as any).uri);
        // const blob = await response.blob();

        const fileContent = await FileSystem.readAsStringAsync((file as any).uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const uint8Array = new Uint8Array(
            atob(fileContent).split('').map(char => char.charCodeAt(0))
        );

        console.log('presignedUrl1', presignedUrl);

        // 使用新的上传函数
        await uploadWithProgressV2(
            presignedUrl,
            uint8Array,
            file.type,
            onProgressChange
        );

        return `${getConfig().ENDPOINT}/${filename}`;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};


export const performSingleUploadV2 = async (file: File, onProgressChange?: (p: number) => void): Promise<string> => {

    let task: any = null;
    let response: any = null;

    try {
        onProgressChange?.(0);

        const filename = await generateFileName(file);

        const putObjectCommand = new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: filename,
            ContentType: file.type,
            ACL: 'public-read',
        });

        const signedUrl = await getSignedUrl(getS3Client(), putObjectCommand, {
            expiresIn: 3600,
        });

        const filePath = (file as any).uri.replace('file://', '');

        // 创建原生上传任务
        task = RNFS.fetch('PUT', signedUrl, {
            'Content-Type': file.type,
        }, RNFS.wrap(filePath));

        task.uploadProgress((written: any, total: any) => {
            const percentage = Math.round((written / total) * 100);
            onProgressChange?.(percentage);
        });

        response = await task;

        const status = response.info().status;

        if (status >= 200 && status < 300) {
            onProgressChange?.(100);
            return `${getConfig().ENDPOINT}/${filename}`;
        } else {
            throw new Error(`Upload failed with status ${status}. Response: ${response.text()}`);
        }
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    } finally {
        response = null;
        task = null;
    }
};
