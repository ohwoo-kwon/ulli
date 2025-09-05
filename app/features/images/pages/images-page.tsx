import type { MouseEvent } from "react";

const images = [
  "https://image.hmall.com/static/8/3/75/38/2238753812_0.jpg?RS=600x600&AR=0&ao=1&cVer=202508121627&SF=webp",
  "https://image.hmall.com/static/0/2/77/38/2238772071_0.jpg?RS=600x600&AR=0&ao=1&cVer=202508130123&SF=webp",
  "https://image.hmall.com/static/5/2/51/38/2238512565_0.jpg?RS=600x600&AR=0&ao=1&cVer=202508071214&SF=webp",
  "https://image.hmall.com/static/5/5/51/39/2239515555_1.jpg?RS=600x600&AR=0&ao=1&cVer=202508280558&SF=webp",
  "https://image.hmall.com/static/1/6/27/39/2239276145_0.jpg?RS=600x600&AR=0&ao=1&cVer=202508221547&SF=webp",
  "https://image.hmall.com/static/0/6/11/09/2209116068_0.jpg?RS=600x600&AR=0&ao=1&cVer=202507292307&SF=webp",
  "https://image.hmall.com/static/2/5/87/32/2232875292_0.jpg?RS=600x600&AR=0&ao=1&cVer=202505151334&SF=webp",
  "https://cdn-img.thehandsome.com/studio/goods/CM/2F/FW/CM2F9WPC661W_TP_W01.jpg?rs=684X1032",
  "https://cdn-img.thehandsome.com/studio/goods/LC/2F/FW/LC2F8WTOD36W_BK_W01.jpg?rs=684X1032",
  "https://cdn-img.thehandsome.com/studio/goods/MW/2F/SS/MW2F3TTO593E_DB_W02.jpg?rs=684X1032",
];

export default function ImagesPage() {
  const handleClick = (e: MouseEvent<HTMLImageElement>) => {
    const {
      currentTarget: { src },
    } = e;

    // form 태그 생성
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://ulli-three.vercel.app/images/upload";

    // 이미지 URL을 hidden input으로 추가
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "imgUrls";
    input.value = src;

    form.appendChild(input);
    document.body.appendChild(form);

    // POST로 전송 후 페이지 이동
    form.submit();
  };

  return (
    <div className="p-8 grid gap-4 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {images.map((src, idx) => (
        <img
          key={idx}
          src={src}
          onClick={handleClick}
          className="w-full aspect-square object-cover rounded border cursor-pointer"
        />
      ))}
    </div>
  );
}
