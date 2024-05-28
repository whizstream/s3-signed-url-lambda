import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

console.log("Loading function");
const s3 = new S3Client();

const generateRandomObjectName = () => {
  return Math.random().toString(36).substring(2, 15);
};

export const handler = async () => {
  const videoId = generateRandomObjectName();
  const bucketName = "ws-streaming-videos-bucket";
  const objectKey = `videos/${videoId}.mp4`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    ContentType: "video/mp4", // Adjust content type as needed
  });

  try {
    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 300 });
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadURL: uploadURL,
        videoId: videoId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not generate the pre-signed URL",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
