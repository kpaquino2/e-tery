import Image from "next/image";

export default function Banner({ id }) {
  return (
    <>
      <div className="relative top-0 left-0 right-0 w-full flex justify-center ">
        <span className="absolute w-full h-1/2 bg-maroon" />
        <Image
          className="clip-banner drop-shadow-2xl"
          src={`banners/${id}`}
          alt="banner"
          width={1200}
          height={600}
        />
      </div>
    </>
  );
}
