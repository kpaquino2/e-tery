import Image from "next/image";

export default function Banner() {
  return (
    <>
      <div className="absolute left-0 right-0 top-[4.5rem] w-full flex justify-center">
        <span className="absolute w-full h-1/2 bg-maroon" />
        <Image
          className="clip-banner"
          src="/banner.png"
          alt="banner"
          width={1200}
          height={600}
        />
      </div>
    </>
  );
}
