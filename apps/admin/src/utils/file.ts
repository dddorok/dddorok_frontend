type FileToStrType = {
  name: string;
  base64: string;
};

export const getFileToBase64 = (files: File[]): Promise<FileToStrType[]> => {
  const fileToBase64 = async (file: File): Promise<FileToStrType> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = ({ target }) => {
        if (target?.result) {
          resolve({
            name: file.name,
            base64: target.result as string,
          });
        } else {
          reject(new Error("Failed to read file"));
        }
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return Promise.all(Array.from(files).map(fileToBase64));
};

export const createFileFromUrl = async (
  url: string,
  filename?: string
): Promise<File | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();

    // 파일명이 없으면 URL에서 추출하거나 기본값 사용
    const finalFilename = filename || url.split("/").pop() || "image";

    return new File([blob], finalFilename, { type: blob.type });
  } catch (error) {
    console.error("Failed to create file from URL:", error);
    return null;
  }
};
