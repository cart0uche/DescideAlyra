import { useState, useEffect } from "react";
import { NFTStorage } from "nft.storage";
import { Spinner } from "@chakra-ui/react";

const UploadIPFS = ({ setFileUrl, setUploaded }) => {
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
      setUploaded(true);
    } catch (err) {
      console.log(err);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (img.length !== 0) {
      upload();
    }
  }, [img]);

  return (
    <div>
      {isUploading && <Spinner />}

      <label>
        <input
          type="file"
          onChange={(e) => {
            setImg(e.target.files[0]);
          }}
        ></input>
      </label>
    </div>
  );
};

export default UploadIPFS;
