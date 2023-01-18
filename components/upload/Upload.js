import { useCallback, useRef, useState } from "react";
import Drawer from "../layout/Drawer";

import ReactCrop from "react-image-crop";
import Image from "next/image";
import "react-image-crop/dist/ReactCrop.css";

export default function Upload({
  finalImage,
  setFinalImage,
  children,
  aspect,
  height,
  width,
  setKey,
}) {
  const imgRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState("");
  const [completedCrop, setCompletedCrop] = useState(null);
  const [crop, setCrop] = useState({
    unit: "px",
    height: height / 5,
    width: width / 5,
  });

  const onSelectFile = (e) => {
    console.log("ah");
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setFile(reader.result);
        setIsOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const getCroppedImage = (image, crop, filename) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          blob.name = filename;
          resolve(blob);
        },
        "image/jpeg",
        1
      );
    });
  };

  const uploadImage = async () => {
    const blobImg = await getCroppedImage(
      imgRef.current.currentTarget,
      completedCrop,
      "banner"
    );
    setFinalImage(blobImg);
    setIsOpen(false);
  };

  const closeDrawer = () => {
    setKey(Math.random | 0);
    setIsOpen(false);
  };
  return (
    <>
      <Drawer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Store Banner"
        close={closeDrawer}
        top={0}
      >
        <ReactCrop
          crop={crop}
          onChange={(_, c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
          keepSelection={true}
          className="mt-12 mx-20 rounded-2xl"
        >
          <Image
            src={file}
            ref={imgRef}
            onLoad={onLoad}
            alt="upload"
            width={width}
            height={height}
          />
        </ReactCrop>
        <div
          className={
            (!completedCrop?.width || !completedCrop?.height
              ? "opacity-25"
              : "") +
            " rounded-full bg-teal text-white font-bold text-lg w-min px-8 py-1 mt-8 mb-8"
          }
          disabled={!completedCrop?.width || !completedCrop?.height}
          onClick={uploadImage}
        >
          upload
        </div>
      </Drawer>
      <label className="flex">
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={onSelectFile}
          onClick={(e) => {
            e.currentTarget.value = null;
          }}
        />
        {finalImage ? (
          <Image
            className="rounded-2xl cursor-pointer drop-shadow-lg"
            src={URL.createObjectURL(finalImage)}
            alt="a"
            width={width}
            height={height}
          />
        ) : (
          <>{children}</>
        )}
      </label>
    </>
  );
}
