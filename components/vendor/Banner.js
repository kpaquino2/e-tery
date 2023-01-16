import Image from "next/image";

export default function Banner({ id }) {
  return (
    <>
      <div className="sticky top-20 left-0 right-0 w-full flex justify-center">
        <span className="absolute w-full h-1/2 bg-maroon" />
        <Image
          className="clip-banner"
          src={`banners/${id}`}
          alt="banner"
          width={1200}
          height={600}
        />
      </div>
    </>
  );
}
