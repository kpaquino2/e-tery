import Image from "next/image";
import { useState } from "react";

export default function Banner({ url }) {
  const [isLoaded, setIsLoaded] = useState(true);

  return (
    <>
      <div
        className={
          "relative top-0 left-0 right-0 w-full flex justify-center " +
          (isLoaded ? "" : "hidden")
        }
      >
        <span className="absolute w-full h-1/2 bg-maroon" />
        <Image
          className="bg-cream clip-banner drop-shadow-2xl"
          src={url}
          alt="banner"
          width={600}
          height={300}
          onError={() => setIsLoaded(false)}
        />
      </div>
    </>
  );
}
