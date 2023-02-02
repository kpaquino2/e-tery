import { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import "react-image-crop/dist/ReactCrop.css";

export default function Upload({
  initialImage,
  setInitialImage,
  setFinalImage,
  children,
  height,
  width,
  loading,
  register,
  name,
}) {
  const imgRef = useRef(null);
  const [scale, setScale] = useState(1);
  const { onChange, ...rest } = register(name);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setInitialImage(reader.result);
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
      {initialImage && (
        <>
          <AvatarEditor
            ref={imgRef}
            image={initialImage}
            width={width}
            height={height}
            className=" -m-20 scale-50 self-center rounded-xl"
            onImageChange={handleImageChange}
            onImageReady={handleImageChange}
            border={30}
            scale={scale}
            crossOrigin="anonymous"
          />
          <input
            onChange={handleScale}
            type="range"
            min={1}
            max={5}
            defaultValue={1}
            step={0.1}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-teal"
          ></input>
        </>
      )}
      <label className="flex">
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={(e) => {
            console.log("aa");
            onSelectFile(e);
            onChange(e);
          }}
          disabled={loading}
          {...rest}
        />
        {!initialImage ? (
          <>{children}</>
        ) : (
          <button
            type="button"
            className="pointer-events-none m-auto underline "
          >
            replace image
          </button>
        )}
      </label>
    </>
  );
}
