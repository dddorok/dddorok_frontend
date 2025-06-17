import { DownloadIcon } from "lucide-react";
import { ComponentProps } from "react";

import { Button } from "./ui/button";

export function DownloadButton({
  fileUrl,
  fileName,
  children = "다운로드",
  ...props
}: ComponentProps<typeof Button> & {
  fileUrl: string;
  fileName: string;
}) {
  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.error("파일 다운로드 중 오류가 발생했습니다:", err);
      });

    props.onClick?.(e);
  };

  return (
    <Button {...props} onClick={handleDownload}>
      <DownloadIcon className="w-4 h-4" />
      {children}
    </Button>
  );
}
