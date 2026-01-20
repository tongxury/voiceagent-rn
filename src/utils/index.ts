import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import {Platform} from "react-native";
import {isImage, isVideo} from "./resource";
import * as VideoThumbnails from "expo-video-thumbnails";
import {Resource} from "@/types";

export const TOKEN_KEY = "user_auth";

export const getAuthToken = async () => {
  return (await AsyncStorage.getItem("user_auth")) ?? "";
  // return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cyI6MTc0Mjk3MTUwOSwidXNlcl9pZCI6IjEifQ.y0puv0MgV7J23G27St9X6nDlNj0HvXdoQFUjgFjZAc8";
};

export const clearAuthToken = async () => {
  return await AsyncStorage.clear();
};

// 保存token的函数
export const setAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

/**
 * 将非空值连接到目标数组
 * @param dest 目标数组
 * @param items 要连接的项目
 * @returns 连接后的数组
 */
export function concatIfNotNull<T>(
  dest: T[],
  ...items: (T | null | undefined)[]
): T[] {
  return dest.concat(
    ...items.filter((item): item is T => item !== null && item !== undefined)
  );
}

export function generateObjectId() {
  const timestamp = Math.floor(new Date().getTime() / 1000)
    .toString(16)
    .padStart(8, "0");
  const machineId = Math.floor(Math.random() * 16777216)
    .toString(16)
    .padStart(6, "0");
  const processId = Math.floor(Math.random() * 65536)
    .toString(16)
    .padStart(4, "0");
  const counter = Math.floor(Math.random() * 16777216)
    .toString(16)
    .padStart(6, "0");

  return timestamp + machineId + processId + counter;
}

export function concatIgnoreUndefined(...arrays: any[]) {
  return arrays
    .filter((x) => x)
    .flat()
    .filter((element) => element !== undefined);
}

export const isIos = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";

export const getUrl = async (item: Resource) => {
  if (isVideo(item)) {
    // 优先本地读文件
    if (item.uri) {
      const f = await FileSystem.getInfoAsync(item.uri);
      if (f.exists) {
        const tr = await VideoThumbnails.getThumbnailAsync(item?.uri!, {
          time: 0,
          quality: 0.5,
        });
        return tr.uri;
      }
    }

    if (item.coverUrl) {
      return item.coverUrl;
    }

    if (item.url) {
      const tr = await VideoThumbnails.getThumbnailAsync(item.url, {
        time: 0,
        quality: 0.5,
      });
      return tr.uri;
    }

    return "";
  }

  if (isImage(item)) {
    // 优先本地读文件
    if (item.uri) {
      const f = await FileSystem.getInfoAsync(item.uri);
      if (f.exists) {
        return f.uri;
      }
    }

    if (item.url) {
      return item.url;
    }

    return "";
  }
};


