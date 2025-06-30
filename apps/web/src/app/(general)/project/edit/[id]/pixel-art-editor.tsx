// 그리드 그리기
if (isGridVisible) {
  // 수직선
  for (let i = 0; i <= cols; i++) {
    ctx.beginPath();
    ctx.strokeStyle = i % 5 === 0 ? "#888" : "#ddd";
    ctx.lineWidth = i % 5 === 0 ? 2 : 1;
    const x = LABEL_MARGIN + i * gridSquareLength;
    ctx.moveTo(x, LABEL_MARGIN);
    ctx.lineTo(x, LABEL_MARGIN + rows * gridSquareLength);
    ctx.stroke();
  }

  // 수평선
  for (let i = 0; i <= rows; i++) {
    ctx.beginPath();
    ctx.strokeStyle = i % 5 === 0 ? "#888" : "#ddd";
    ctx.lineWidth = i % 5 === 0 ? 2 : 1;
    const y = LABEL_MARGIN + i * gridSquareLength;
    ctx.moveTo(LABEL_MARGIN, y);
    ctx.lineTo(LABEL_MARGIN + cols * gridSquareLength, y);
    ctx.stroke();
  }
}
