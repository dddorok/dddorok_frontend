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
