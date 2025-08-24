const fs = require("fs");
const path = require("path");
const ImageKit = require("imagekit");
require('dotenv').config();

// Initialize ImageKit SDK
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "your_public_api_key",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "your_private_api_key",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/your_imagekit_id/",
});

// Path to your local images folder
const IMAGES_FOLDER = "./images"; // change if needed

async function uploadImage(filePath, fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) return reject(err);

            imagekit.upload(
                {
                    file: data, // raw file buffer
                    fileName: fileName,
                    folder: "/crops", // optional: ImageKit folder
                    tags: ["bulk", "upload"], // optional: tags
                    useUniqueFileName: false, // optional: to avoid overwriting
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    });
}

async function uploadAllImages() {
    try {
        const files = fs.readdirSync(IMAGES_FOLDER).filter(file =>
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        );

        console.log(`Found ${files.length} images. Starting parallel upload...`);

        // Upload all files in parallel
        const results = await Promise.all(
            files.map(file => {
                const filePath = path.join(IMAGES_FOLDER, file);
                return uploadImage(filePath, file).then(
                    result => `✅ Uploaded: ${result.name} -> ${result.url}`,
                    error => `❌ Error uploading ${file}: ${error.message}`
                );
            })
        );

        results.forEach(msg => console.log(msg));
        console.log("🎉 All uploads complete!");
    } catch (err) {
        console.error("❌ Fatal error:", err);
    }
}

uploadAllImages();
