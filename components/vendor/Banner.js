import Image from "next/image";
import { useState } from "react";

export default function Banner({ url }) {
  const [imgSrc, setImgSrc] = useState(url);

  return (
    <>
      <div className="drop-shadow-lg relative top-0 left-0 right-0 w-full flex justify-center ">
        <span className="absolute w-full h-1/2 bg-maroon" />
        <Image
          className="bg-cream clip-banner drop-shadow-2xl"
          src={imgSrc}
          alt=""
          width={600}
          height={300}
          onError={() => setImgSrc("graphics/default.png")}
        />
      </div>
    </>
  );
}
