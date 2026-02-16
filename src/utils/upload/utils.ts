import * as FileSystem from "expo-file-system";
import SparkMD5 from "spark-md5";
import axios from 'axios';
const generateId = () => Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);


export const UPLOAD_CONFIG = {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    CHUNK_SIZE: 5 * 1024 * 1024, // 5MB分片
    MIN_MULTIPART_SIZE: 20 * 1024 * 1024, // 20MB以下使用普通上传
};


export const UPLOAD_CONSTANTS = {
    CHUNK_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_FILE_SIZE: 1024 * 1024 * 1000, // 1000MB
    UPLOAD_TIMEOUT: 300000, // 5 minutes
};


export interface RNFile {
    uri: string;
    name: string;
    type: string;
    size?: number;
}

const CHUNK_SIZE = 2097152; // 2MB

export const calculateMD5 = async (file: RNFile | File): Promise<string> => {
    // 检查是否是 React Native 文件对象
    if ("uri" in file) {
        try {
            // 检查文件是否存在
            const fileInfo = await FileSystem.getInfoAsync(file.uri);
            if (!fileInfo.exists) {
                throw new Error("File does not exist");
            }

            const fileSize = fileInfo.size;
            const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);
            const spark = new SparkMD5.ArrayBuffer();

            // 分块读取文件
            for (let i = 0; i < totalChunks; i++) {
                const start = i * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, fileSize);

                // 读取文件片段
                const response = await fetch(file.uri);
                const blob = await response.blob();
                const arrayBuffer = await new Promise<ArrayBuffer>(
                    (resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as ArrayBuffer);
                        reader.onerror = reject;
                        reader.readAsArrayBuffer(blob.slice(start, end));
                    }
                );

                spark.append(arrayBuffer);
            }

            return spark.end();
        } catch (error) {
            console.error("Error calculating MD5:", error);
            throw error;
        }
    } else {
        // Web环境的原有逻辑
        const webFile = file as File;
        return new Promise((resolve, reject) => {
            const chunks = Math.ceil(webFile.size / CHUNK_SIZE);
            let currentChunk = 0;
            const spark = new SparkMD5.ArrayBuffer();
            const fileReader = new FileReader();

            fileReader.onload = (e) => {
                spark.append(e.target?.result as ArrayBuffer);
                currentChunk++;

                if (currentChunk < chunks) {
                    loadNext();
                } else {
                    resolve(spark.end());
                }
            };

            fileReader.onerror = (e) => {
                reject(e);
            };

            function loadNext() {
                const start = currentChunk * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, webFile.size);
                fileReader.readAsArrayBuffer(webFile.slice(start, end));
            }

            loadNext();
        });
    }
};

export const getFileExtension = (filename: string): string => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};


export const uploadWithProgressV2 = async (
    url: string,
    data: Blob | Buffer | any,
    contentType: string,
    onProgress?: (progress: number) => void
): Promise<void> => {
    const inst = axios.create()

    // 对于二进制数据，移除默认的 transformRequest，防止 axios 尝试将其 JSON.stringify
    inst.defaults.transformRequest = (data, headers) => {
        return data;
    };

    const response = await inst.put(url, data, {
        headers: {
            'Content-Type': contentType
        },
        // 配置上传进度回调
        onUploadProgress: (progressEvent) => {
            onProgress?.(Math.floor((progressEvent?.progress || 0) * 100) || 1)
            // if (progressEvent.total) {
            //     const percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
            //     onProgress?.(Math.round(percentComplete));
            // }
        }
    });

    console.log('uploadWithProgressV2', response);
};


// 添加一个新的辅助函数来处理上传进度
export const uploadWithProgress = async (
    url: string,
    data: Blob | Buffer | any,
    contentType: string,
    onProgress?: (progress: number) => void
): Promise<Response> => {

    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                onProgress?.(Math.round(percentComplete));
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(new Response(xhr.response, {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: new Headers({
                        'ETag': xhr.getResponseHeader('ETag') || ''
                    })
                }));
            } else {
                reject(new Error(`HTTP Error: ${xhr.status} ${JSON.stringify(xhr.response)}`));
            }
        };

        xhr.onerror = () => reject(new Error('Network Error'));
        xhr.ontimeout = () => reject(new Error('Timeout Error'));

        xhr.open('PUT', url);
        xhr.setRequestHeader('Content-Type', contentType);
        xhr.send(data);
    });
};


export const generateFileName = async (file: File): Promise<string> => {
    // const md5 = await calculateMD5(file);
    const extension = getFileExtension(file.name);
    return `${generateId().toLowerCase()}.${extension}`;
};
