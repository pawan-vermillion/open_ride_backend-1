    const cloudinary = require("cloudinary").v2
    require("dotenv").config();


    cloudinary.config({
        cloud_name : process.env.CLOUD_NAME,
        api_key : process.env.CLOUD_API_KEY,
        api_secret : process.env.CLOUD_API_SECRET
    })
    const deleteOldImages = async (urls) => {
        if (!urls) return;
        const urlsArray = Array.isArray(urls) ? urls : [urls];
        for (const url of urlsArray) {
          const public_id = getPublicIdFromUrl(url);
          if (public_id) {
            try {
              await cloudinary.uploader.destroy(public_id);
            } catch (error) {
              console.error(`Error deleting old image ${public_id}:`, error);
            }
          }
        }
      };
      
      const getPublicIdFromUrl = (url) => {
        const matches = url.match(/\/v[0-9]+\/(.+?)\.[a-z]+$/);
        return matches ? matches[1] : null;
      };
      

    module.exports = {cloudinary ,deleteOldImages , getPublicIdFromUrl};
