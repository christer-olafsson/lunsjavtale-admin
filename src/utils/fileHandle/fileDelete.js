import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Set up AWS S3 client
const s3Client = new S3Client({ region: "ap-south-1" }); // Replace "your-region" with your AWS region

// Function to delete an object from S3
export const fileDelete = async (objectKey) => {
  try {
    const deleteParams = {
      Bucket: 'lunsjavtale',
      Key: objectKey
    };

    const command = new DeleteObjectCommand(deleteParams);
    const response = await s3Client.send(command);

    console.log('delete res:',response);
    return response;
  } catch (err) {
    console.error("Error deleting object:", err);
    throw err;
  }
}

// Example usage
// const bucketName = "your-bucket-name"; // Replace "your-bucket-name" with your bucket name
// const objectKey = "your-object-key"; // Replace "your-object-key" with the key of the object you want to delete

// deleteObject(bucketName, objectKey)
//   .then(() => console.log("Object deleted successfully"))
//   .catch(err => console.error("Error deleting object:", err));




















// import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

// const client = new S3Client({
//   region: 'ap-south-1',
//   // credentials: {
//   //   bucketName: 'lunsjavtale',
//   //   region: 'ap-south-1',
//   //   accessKeyId: 'AKIA4MTWOF3J3NOCSZNB',
//   //   secretAccessKey: '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',
//   //   s3Url: 'https://lunsjavtale.s3.ap-south-1.amazonaws.com'
//   // }
// });

// export const fileDelete = async (key) => {
//   const command = new DeleteObjectCommand({
//     Bucket: "lunsjavtale",
//     Key: key
//   });

//   try {
//     const response = await client.send(command);
//     console.log('response', response);
//   } catch (err) {
//     console.error('deleteErr:', err);
//   }
// };




















// import ReactS3Client from "react-aws-s3-typescript";


// export const fileDelete = async (filepath) => {
//   const config = {
//     bucketName: 'lunsjavtale',
//     region: 'ap-south-1',
//     accessKeyId: 'AKIA4MTWOF3J3NOCSZNB',
//     secretAccessKey: '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',
//     s3Url: 'https://lunsjavtale.s3.ap-south-1.amazonaws.com'
//   }
//   const S3 = new ReactS3Client(config);
//   try {
//     await S3.deleteFile('stage/staff/noo1WHjVqYpJTFwPoDT7vU.png');
//     console.log('File deleted');
//   } catch (exception) {
//     console.log(exception);
//     /* handle the exception */
//   }
//   // return new Promise((resolve, reject) => {
//   //   S3.deleteFile(filepath)
//   //     .then(data => resolve(data))
//   //     .catch(err => reject(console.log('deleteErr:', err)))
//   // })
// }