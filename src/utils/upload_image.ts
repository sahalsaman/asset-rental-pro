import axios from "axios";
import { env } from "../../environment";

export async function uploadToImgbb(base64Image: string, albumId?: string) {
  try {
    if (!env.IMGBB_API_KEY) throw new Error("IMGBB API key not found.");

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const formData = new FormData();
    formData.append("key", env.IMGBB_API_KEY);
    formData.append("image", base64Data);
    if (albumId) formData.append("album", albumId);
    const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });


    return response.data.data
  } catch (error: any) {
    console.error("❌ imgbb upload error:", error.response?.data || error.message);
    return null;
  }
}

export async function deleteFromImgbb(deleteUrl: string) {
  try {
    console.log("deleteUrl.......", deleteUrl);

    const res = await axios.get(deleteUrl);

    console.log("✅ Image deleted:", res.status);
    return true;
  } catch (error: any) {
    console.error("❌ Failed to delete image:", error.response?.data || error.message);
    return false;
  }
}

export async function updateImgbbImage(oldUrl: string, base64Image: string, albumId?: string) {
  const res = await uploadToImgbb(base64Image, albumId)
  console.log(res);
  
  if (res?.url) {
    await deleteFromImgbb(oldUrl)
  }
  return res;
}