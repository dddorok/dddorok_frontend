"use server";

export async function fetchSvg(url: string) {
  try {
    const response = await fetch(url);
    const content = await response.text();
    return { content };
  } catch (error) {
    throw new Error("SVG 파일을 가져오는데 실패했습니다.");
  }
}
