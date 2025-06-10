import { useRef, useState, type Dispatch, type SetStateAction } from "react";

export default function ImageUpload({
  name,
  preview,
  setPreview,
}: {
  name: string;
  preview: string | null;
  setPreview: Dispatch<SetStateAction<string | null>>;
}) {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageDivRef = useRef<HTMLDivElement | null>(null);
  const MAX_FILE_SIZE = 5000 * 1024; // 10MB 제한

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreview(null);
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError("파일 크기는 10MB를 초과할 수 없습니다.");
        return;
      }

      setError(null);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    imageDivRef.current?.classList.add("bg-gray-200");
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setPreview(null);
    const file = event.dataTransfer.files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError("파일 크기는 10MB를 초과할 수 없습니다.");
        return;
      }

      setError(null);
      setPreview(URL.createObjectURL(file));
    }
    imageDivRef.current?.classList.remove("bg-gray-200");
  };

  const openFileDialog = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); // 이벤트 전파 방지
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border-2 border-dashed border-gray-300 rounded flex items-center justify-center w-full aspect-square cursor-pointer bg-gray-50 ${
        preview ? "" : "hover:bg-gray-200"
      } transition`}
      onDragLeave={() => {
        imageDivRef.current?.classList.remove("bg-gray-200");
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={openFileDialog}
      ref={imageDivRef}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        name={name}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {preview ? (
        <div className="relative w-full h-full">
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-contain rounded"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-400">
          {error ? (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16V8a2 2 0 012-2h14a2 2 0 012 2v8m-4-3l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              <p className="mt-2 text-sm">
                이미지를 드래그하거나 클릭하여 업로드하세요
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
