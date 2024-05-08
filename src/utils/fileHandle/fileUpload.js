import ReactS3Client from 'react-aws-s3-typescript';

export const fileUpload = (file, dir) => {
  const config = {
    bucketName: 'lunsjavtale',
    dirName: 'stage/' + dir,
    region: 'ap-south-1',
    accessKeyId: 'AKIA4MTWOF3J3NOCSZNB',
    secretAccessKey: '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',
    s3Url: 'https://lunsjavtale.s3.ap-south-1.amazonaws.com'
  }
  const S3 = new ReactS3Client(config);
  return new Promise((resolve, reject) => {
    S3.uploadFile(file)
      .then(data => resolve(data))
      .catch(err => reject(console.log('uploadErr:', err)))
  })
}




















// import axios from "axios";

// const UPLOAD_PRESET = 'hwlhcfbe'
// const CLOUD_NAME = 'dj0bdzype'

// export const fileUpload = async (file) => {
//   const data = new FormData();
//   data.append("file", file);
//   data.append("upload_preset", UPLOAD_PRESET);
//   data.append("cloud_name", CLOUD_NAME);
//   try{
//     const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,data);
//     return res.data;
//   }catch(err){
//     console.log("cloudinary err : ",err);
//   }
// }

