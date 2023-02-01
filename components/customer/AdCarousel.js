import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";

export default function AdCarousel({ ads }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
    },
    [
      (slider) => {
        let timeout;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 5000);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );
  return (
    <>
      <div ref={sliderRef} className="keen-slider">
        {ads?.map((ad, index) => (
          <div key={index} className="keen-slider__slide drop-shadow">
            <Image
              src={`advertisements/${ad.name}`}
              alt=""
              width={525}
              height={120}
              className="pointer-events-none"
            />
          </div>
        ))}
      </div>
      {loaded && instanceRef.current && (
        <div className="flex gap-4 justify-center mt-1">
          {[
            ...Array(instanceRef.current.track.details.slides.length).keys(),
          ].map((idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx);
                }}
                className={
                  "w-1.5 h-1.5 border border-maroon rounded-full " +
                  (currentSlide === idx ? "bg-maroon" : "bg-cream")
                }
              ></button>
            );
          })}
        </div>
      )}
    </>
  );
}
