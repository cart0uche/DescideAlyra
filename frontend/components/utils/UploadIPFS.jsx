import { useState } from "react";
import { NFTStorage } from "nft.storage";
import { Button } from "@chakra-ui/react";

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
         setFileUrl(url);
      } catch (err) {
         console.log(err);
      } finally {
         setIsUploading(false);
      }
   };

   return (
      <div>
         <div>
            <label>
               <input
                  type="file"
                  onChange={(e) => setImg(e.target.files[0])}
               ></input>
            </label>
         </div>
         <Button isLoading={isUploading} onClick={upload}>
            Upload image to IPFS
         </Button>
      </div>
   );
};

export default UploadIPFS;
