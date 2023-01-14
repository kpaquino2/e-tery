import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";

export default function AdCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });
  return (
    <>
      <div ref={sliderRef} className="keen-slider">
        <div className="keen-slider__slide bg-cream border-4 border-maroon text-4xl h-28 grid place-items-center">
          advertisement
        </div>
        <div className="keen-slider__slide bg-cream border-4 border-maroon text-4xl h-28 grid place-items-center">
          advertisement
        </div>
        <div className="keen-slider__slide bg-cream border-4 border-maroon text-4xl h-28 grid place-items-center">
          advertisement
        </div>
        <div className="keen-slider__slide bg-cream border-4 border-maroon text-4xl h-28 grid place-items-center">
          advertisement
        </div>
        <div className="keen-slider__slide bg-cream border-4 border-maroon text-4xl h-28 grid place-items-center">
          advertisement
        </div>
        <div className="keen-slider__slide bg-cream border-4 border-maroon text-4xl h-28 grid place-items-center">
          advertisement
        </div>
        <div className="keen-slider__slide bg-cream border-4 border-maroon text-4xl h-28 grid place-items-center">
          advertisement
        </div>
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
