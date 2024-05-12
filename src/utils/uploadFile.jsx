import axios from 'axios';

const UPLOAD_PRESET = 'hwlhcfbe'
const CLOUD_NAME = 'dj0bdzype'

export const uploadFile = async (file, path) => {
  try {
    const randomFileName = Math.random().toString(36).substring(2, 10);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('public_id', `stage/${path}/${randomFileName}`); //for upload in folder
    const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);
    return (response.data);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

export const uploadMultiFile = async (files, path) => {
  try {
    const data = await Promise.all(
      [...files].map(async (file) => {
        const res = await uploadFile(file, path);
        return res;
      })
    );
    return data;
  } catch (error) {
    console.error('Error uploading files:', error);
  }
}










{/* const url = "https://api.cloudinary.com/v1_1/hzxyensd5/image/upload";
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const files = document.querySelector("[type=file]").files;
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    formData.append("file", file);
    formData.append("upload_preset", "docs_upload_example_us_preset");

    fetch(url, {
      method: "POST",
      body: formData
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        document.getElementById("data").innerHTML += data;
      });
  }
}); */}