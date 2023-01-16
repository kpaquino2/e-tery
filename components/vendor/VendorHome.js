import Banner from "./Banner";

export default function VendorHome({ data }) {
  return (
    <div className="flex flex-col items-center">
      <Banner />
      <div className="font-bold text-4xl">{data.name}</div>
      <div className="flex flex-col">
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
        {data.categories.map((value, index) => (
          <div key={index} className="text-2xl font-semibold">
            {value.name}
          </div>
        ))}
      </div>
    </div>
  );
}
