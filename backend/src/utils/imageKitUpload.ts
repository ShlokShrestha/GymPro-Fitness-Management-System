import ImageKit from "imagekit";

const PRIVATE_KEY = process.env.IMAGE_KIT_PRIVATE_KEY;
const PUBLIC_KEY = process.env.IMAGE_KIT_PUBLIC_KEY;

let imagekit: ImageKit;
if (PUBLIC_KEY && PRIVATE_KEY) {
  imagekit = new ImageKit({
    publicKey: PUBLIC_KEY,
    privateKey: PRIVATE_KEY,
    urlEndpoint: "https://ik.imagekit.io/43te21u1u",
  });
}

export const uploadImageKit = async (uploadParams: any) => {
  const response = await imagekit.upload(uploadParams);
  return response;
};

export const deleteImageKit = async (imageId: string) => {
  const response = await imagekit.deleteFile(imageId);
  return response;
};
