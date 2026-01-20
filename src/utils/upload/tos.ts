import { getConfig } from "@/config";
import { getFileExtension, RNFile } from "@/utils/upload/utils";
import { TosClient } from '@volcengine/tos-sdk';
import * as FileSystem from 'expo-file-system';
import 'react-native-get-random-values';
import { v4 } from 'uuid';

// 使用 UUID 生成文件名，避免大文件计算 MD5 耗时/崩溃
const generateFileName = (file: RNFile): string => {
    const extension = getFileExtension(file.name || file.uri);
    return `${v4()}.${extension}`;
};

/**
 * 使用 FileSystem.uploadAsync 进行原生上传，支持大文件
 */
export const upload = async (file: RNFile, onProgressChange?: (p: number) => void): Promise<string> => {
    try {
        onProgressChange?.(0);
        const filename = generateFileName(file);

        // 1. 获取预签名 URL (仍然需要 TosClient 或后端 API，这里假设前端有 Key)
        // 注意：TOS SDK 在 RN 中可能并不完全兼容，单纯用来生成签名 URL 也可以
        const client = new TosClient({
            accessKeyId: getConfig().TOS_ACCESS_KEY_ID,
            accessKeySecret: getConfig().TOS_ACCESS_KEY_SECRET,
            region: getConfig().TOS_REGION,
            endpoint: getConfig().TOS_ENDPOINT,
            bucket: getConfig().TOS_BUCKET,
        });

        const signedUrl = client.getPreSignedUrl({
            key: filename,
            method: 'PUT',
        });

        // 2. 使用 FileSystem 原生上传
        const response = await FileSystem.uploadAsync(signedUrl, file.uri, {
            httpMethod: 'PUT',
            uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
            headers: {
                'Content-Type': file.type || 'application/octet-stream',
            },
        });

        if (response.status >= 200 && response.status < 300) {
            onProgressChange?.(100);
            return `https://${getConfig().TOS_BUCKET}.${getConfig().TOS_ENDPOINT}/${filename}`;
        } else {
            throw new Error(`Upload failed with status ${response.status}: ${response.body}`);
        }

    } catch (error) {
        console.error('Upload Error:', error);
        throw error;
    }
};
