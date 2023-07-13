import { useState, useEffect   } from "react";
import { NFTStorage } from "nft.storage";

const UploadIPFS = ({ setFileUrl }) => {
   const [img, setImg] = useState([]);
   const [isUploading, setIsUploading] = useState(false);

   const upload = async () => {
      try {
         const client = new NFTStorage({
            token: process.env.NEXT_PUBLIC_NFT_STORAGE,
         });
         const blob = new Blob([img], { type: img.type });
         setIsUploading(true);
         const imageCid = await client.storeBlob(blob);
         const url = `https://ipfs.io/ipfs/${imageCid}`;
         console.log("NFT metadata uploaded to IPFS : ", url);
         setFileUrl(imageCid);
      } catch (err) {
         console.log(err);
      } finally {
         setIsUploading(false);
      }
   };

   useEffect(() => {
      upload();
   }, [img]);

   return (
      <div>
         <div>
            <label>
               <input
                  type="file"
                  onChange={(e) => {
                     setImg(e.target.files[0]);
                  }}
               ></input>
            </label>
         </div>
      </div>
   );
};

export default UploadIPFS;
