import fsSync from "fs";
import fs from "fs/promises";
import path from "path";
import { Express } from "express";
import multer, { StorageEngine } from "multer";
import cloudinary from "../config/cloudinary.config";

// 🧱 Create upload directory if not exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fsSync.existsSync(uploadDir)) {
  fsSync.mkdirSync(uploadDir, { recursive: true });
}

// ⚙️ Multer storage setup
const storage: StorageEngine = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(sanitizedFilename)}`,
    );
  },
});

// 📝 File filter for security
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  const ext = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// 🧹 Helper: Safe file deletion
const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (error) {
    // File doesn't exist or already deleted, ignore
  }
};

// ☁️ Upload to Cloudinary with main + thumbnail
export const uploadImageWithThumbnail = async (file: Express.Multer.File) => {
  try {
    // Validate file exists
    if (!file || !file.path) {
      throw new Error("No file provided");
    }

    // 1️⃣ Upload main image (optimized)
    const mainResult = await cloudinary.uploader.upload(file.path, {
      folder: "foshol-bazar/products",
      resource_type: "image",
      transformation: [
        { width: 1000, height: 1000, crop: "limit" },
        { quality: "auto:good" }, // Better quality setting
        { fetch_format: "auto" },
      ],
    });

    // 2️⃣ Create thumbnail version (smaller)
    const thumbnailResult = await cloudinary.uploader.upload(file.path, {
      folder: "foshol-bazar/thumbnails",
      resource_type: "image",
      transformation: [
        { width: 300, height: 300, crop: "fill", gravity: "auto" }, // Smart cropping
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    });

    // 🧹 Delete local file
    await deleteFile(file.path);

    return {
      mainImage: {
        url: mainResult.secure_url,
        public_id: mainResult.public_id,
        width: mainResult.width,
        height: mainResult.height,
        format: mainResult.format,
      },
      thumbnail: {
        url: thumbnailResult.secure_url,
        public_id: thumbnailResult.public_id,
        width: thumbnailResult.width,
        height: thumbnailResult.height,
        format: thumbnailResult.format,
      },
    };
  } catch (error) {
    // Cleanup on error
    if (file?.path) {
      await deleteFile(file.path);
    }
    throw error;
  }
};

// 🗑️ Delete images from Cloudinary
export const deleteImagesFromCloudinary = async (
  publicIds: string[],
): Promise<void> => {
  try {
    const deletePromises = publicIds.map((id) =>
      cloudinary.uploader.destroy(id),
    );
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting images from Cloudinary:", error);
    throw new Error("Failed to delete images from Cloudinary");
  }
};

// 📤 Batch upload multiple images
export const uploadMultipleImages = async (
  files: Express.Multer.File[],
): Promise<
  Array<{
    mainImage: {
      url: string;
      public_id: string;
      width: number;
      height: number;
      format: string;
    };
    thumbnail: {
      url: string;
      public_id: string;
      width: number;
      height: number;
      format: string;
    };
  }>
> => {
  try {
    const uploadPromises = files.map((file) => uploadImageWithThumbnail(file));
    return await Promise.all(uploadPromises);
  } catch (error) {
    // Cleanup all files on error
    await Promise.all(files.map((file) => deleteFile(file.path)));
    throw error;
  }
};

export const fileUploader = {
  upload,
  uploadImageWithThumbnail,
  deleteImagesFromCloudinary,
  uploadMultipleImages,
};
