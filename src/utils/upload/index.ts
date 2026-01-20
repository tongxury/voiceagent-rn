// import {performSingleUpload as _performSingleUpload} from "./oss"
// import {performSingleUpload as _performSingleUpload} from "./s3"
import { upload } from "./tos";
// import {performSingleUpload as _performSingleUpload} from "./s3_v2"


export const performSingleUpload = async (file: any, onProgressChange?: (p: number) => void): Promise<string> => {

    // if (getConfig().STORAGE === "s3") {
    //     return performSingleUploadS3(file as any, onProgressChange);
    // }
    // console.log('performSingleUpload', file)
    return upload(file, onProgressChange);
}

// // 分片上传会出现上传失败的情况 慎用
// export const performMultipartUpload = async (file: File, onProgressChange: (p: number) => void): Promise<string> => {
//     return performSingleUploadOss(file, onProgressChange);
//     // return performSingleUploadS3(file, onProgressChange);
// }


