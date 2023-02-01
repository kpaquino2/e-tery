import { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import "react-image-crop/dist/ReactCrop.css";

export default function Upload({
  setFinalImage,
  children,
  height,
  width,
  loading,
  register,
  name,
}) {
  const imgRef = useRef(null);
  const [file, setFile] = useState("");
  const [scale, setScale] = useState(1);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setFile(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleScale = (e) => {
    const scale = parseFloat(e.target.value);
    setScale(scale);
  };

  const handleImageChange = async () => {
    if (imgRef.current) {
      const canvasScaled = await imgRef.current.getImageScaledToCanvas();
      canvasScaled.toBlob((blob) => setFinalImage(blob));
    }
  };

  return (
    <>
      {file && (
        <>
          <AvatarEditor
            ref={imgRef}
            image={file}
            width={width}
            height={height}
            className=" rounded-xl scale-50 -m-20 self-center"
            onImageChange={handleImageChange}
            onImageReady={handleImageChange}
            border={30}
            scale={scale}
          />
          <input
            {...register(name)}
            onChange={handleScale}
            type="range"
            min={1}
            max={5}
            defaultValue={1}
            step={0.1}
            className="w-full h-2 bg-teal rounded-lg appearance-none cursor-pointer"
          ></input>
        </>
      )}
      <label className="flex">
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={onSelectFile}
          disabled={loading}
        />
        {!file ? (
          <>{children}</>
        ) : (
          <button
            type="button"
            className="m-auto underline pointer-events-none "
          >
            replace image
          </button>
        )}
      </label>
    </>
  );
}
