/* eslint-disable @next/next/no-img-element */
import { UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UploadFileFormProps {
  file: File | null;
  setFile: (file: File | null) => void;
  onRemove: () => void;
}

// apps/admin/src/app/(admin)/chart-types/_components/svg-upload.tsx
// UploadFileForm
// TODO : 겹치는 부분 정리하기
export function ImageUpload({ file, setFile, onRemove }: UploadFileFormProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  if (file) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>템플릿 이미지 업로드</CardTitle>
          <CardDescription>템플릿 이미지를 업로드해주세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-40">
            <img
              src={URL.createObjectURL(file)}
              alt="template"
              className="h-full"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button onClick={onRemove}>삭제</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>파일 업로드</CardTitle>
        <CardDescription>
          업로드할 파일을 선택하고 다음 버튼을 클릭하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer  dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadIcon className="w-10 h-10 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="font-semibold">클릭하여 업로드</span> 또는
                드래그 앤 드롭
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
