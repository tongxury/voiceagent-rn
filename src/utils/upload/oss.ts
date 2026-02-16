import { fetchUploadToken } from "@/api/api";
import { getConfig } from "@/config";
import { getFileExtension, RNFile } from "@/utils/upload/utils";
import axios from 'axios';
import 'react-native-get-random-values';
// import { v4 } from "uuid";
const generateId = () => Math.random().toString(36).substring(2, 10);

// 生成文件名
const generateFileName = async (file: RNFile): Promise<string> => {
    const extension = getFileExtension(file.name);
    return `${generateId()}.${extension}`;
};

// 使用 axios 直传七牛
export const performSingleUpload = async (
    file: RNFile,
    onProgressChange?: (p: number) => void
): Promise<string> => {
    try {
        onProgressChange?.(0);
        const fileKey = await generateFileName(file);

        const tr = await fetchUploadToken({ bucket: getConfig().QINIU_BUCKET });
        const token = tr.data?.data?.token;

        // 构造 FormData
        const formData = new FormData();
        // @ts-ignore
        formData.append('file', {
            uri: file.uri,
            type: file.type,
            name: fileKey,
        });
        formData.append('token', token);
        formData.append('key', fileKey);

        // 七牛上传地址（华东区域，其他区域请更换）
        const uploadUrl = 'https://upload.qiniup.com';

        const inst = axios.create()
        const res = await inst.post(uploadUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                console.log('progressEvent', progressEvent);

                if (progressEvent.total) {
                    const percent = progressEvent.loaded / progressEvent.total;
                    onProgressChange?.(percent);
                }
            },
        });

        console.log('res', res);
        // 返回文件在七牛的 key 或完整 url
        return `${getConfig().QINIU_ENDPOINT}/${fileKey}`;
    } catch (error) {
        console.error('Upload Error:', error);
        throw error;
    }
};
