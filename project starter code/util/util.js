import fs from "fs";
import Jimp from "jimp";
import axios from 'axios';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL) {
  console.log("inputURL");

  //   try {
  //     const response = await axios.get(inputURL, { responseType: 'arraybuffer' });
  //     const buffer = Buffer.from(response.data);
  //     console.log("inputURL111");
  //     return res.status(400).send("OK");
  //     // Xử lý buffer...
  // } catch (error) {
  //     return res.status(400).send("Could not fetch image from URL");
  // }

  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(inputURL, { responseType: 'arraybuffer' });

      const contentType = response.headers['content-type'];
      if (!contentType.startsWith('image/')) {
        console.log("xxxxx");
        return response.status(400).send('URL does not point to an image');
      }

      const buffer = Buffer.from(response.data);

      const photo = await Jimp.read(buffer);


      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, (img) => {
          console.log("inputURL");

          resolve({statusCode: 200, data:outpath});
        });
    } catch (error) {
      console.log("yyyyy");
      reject({statusCode: 404, error:error});
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
