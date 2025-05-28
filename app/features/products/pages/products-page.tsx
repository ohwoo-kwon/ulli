import { Button } from "~/common/components/ui/button";

export default function ProductsPage() {
  const images = [
    "https://image.hmall.com/static/3/8/19/13/2213198396_0.jpg?RS=600x600&AR=0&ao=1&SF=webp",
    "https://image.hmall.com/static/3/8/19/13/2213198369_0.jpg?RS=600x600&AR=0&ao=1&cVer=202502211648&SF=webp",
    "https://image.hmall.com/static/2/4/84/07/2207844270_0.jpg?RS=600x600&AR=0&ao=1&cVer=202504081405&SF=webp",
    "https://image.hmall.com/static/5/8/12/29/2229128528_0.jpg?RS=600x600&AR=0&ao=1&cVer=202504031341&SF=webp",
    "https://image.hmall.com/static/1/9/68/48/2148689113_0.png?RS=600x600&AR=0&ao=1&cVer=202503311518&SF=webp",
    "https://image.hmall.com/static/3/4/78/26/2226784389_0.jpg?RS=600x600&AR=0&ao=1&cVer=202504180928&SF=webp",
    "https://image.hmall.com/static/7/5/26/08/2208265794_0.jpg?RS=600x600&AR=0&ao=1&cVer=202405290909&SF=webp",
    "https://image.hmall.com/static/9/3/69/55/2155693983_1.jpg?RS=600x600&AR=0&ao=1&cVer=202311241435&SF=webp",
    "https://image.hmall.com/static/4/4/41/26/2226414474_1.jpg?RS=600x600&AR=0&ao=1&cVer=202412271723&SF=webp",
    "https://image.hmall.com/static/4/4/41/26/2226414474_2.jpg?RS=600x600&AR=0&ao=1&cVer=202412271723&SF=webp",
    "https://image.hmall.com/static/4/4/41/26/2226414474_3.jpg?RS=600x600&AR=0&ao=1&cVer=202412261726&SF=webp",
  ];
  return (
    <div className="p-8 grid gap-4 w-fit mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {images.map((src, idx) => (
        <div
          key={idx}
          className="relative overflow-hidden rounded-xl shadow-lg max-size-96"
        >
          <img src={src} className="peer size-96 object-cover" />
          <Button className="absolute bottom-2 left-1/2 -translate-x-1/2 transition-all duration-500 opacity-0 translate-y-10 hover:translate-y-0 hover:opacity-100 peer-hover:translate-y-0 peer-hover:opacity-100">
            입어보기
          </Button>
        </div>
      ))}
    </div>
  );
}
