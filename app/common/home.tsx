import { useEffect, useRef, useState } from "react";

export default function Home() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div>
      <form action="/images/upload" method="POST">
        <input
          type="hidden"
          defaultValue="https://image.hmall.com/static/3/8/19/13/2213198396_0.jpg"
          name="imgUrls"
        />
        <input
          type="hidden"
          defaultValue="https://image.hmall.com/static/3/8/19/13/2213198369_0.jpg"
          name="imgUrls"
        />
        <input
          type="hidden"
          defaultValue="https://image.hmall.com/static/2/4/84/07/2207844270_0.jpg"
          name="imgUrls"
        />
        <button type="submit">이동</button>
      </form>
      <div className="relative w-full overflow-hidden">
        <svg
          className="absolute inset-0 w-full"
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
        >
          <defs>
            <clipPath id="waveClip" clipPathUnits="objectBoundingBox">
              <path
                d="
                  M0,0
                  L0,0.9
                  C0.2, 1 0.3, 1 0.5, 0.9
                  C0.7, 0.8 0.8, 0.8 1, 0.9
                  L1, 0
                  Z
                "
              />
            </clipPath>
          </defs>
        </svg>
        <div
          className="w-full max-h-[calc(100vh-44px)]"
          style={{
            clipPath: "url(#waveClip)",
            WebkitClipPath: "url(#waveClip)",
          }}
        >
          <video autoPlay muted loop className="w-full object-contain">
            <source src="https://storage.googleapis.com/gweb-uniblog-publish-prod/original_videos/prism-i2v-gif-720-v2_1_2-05-20-10-29.mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
