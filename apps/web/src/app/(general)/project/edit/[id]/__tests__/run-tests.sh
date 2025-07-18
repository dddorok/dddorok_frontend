#!/bin/bash

echo "🧪 픽셀 아트 에디터 테스트 실행"
echo "=================================="

# TypeScript 컴파일 체크
echo "📝 TypeScript 컴파일 체크..."
npx tsc --noEmit --project tsconfig.json
if [ $? -eq 0 ]; then
    echo "✅ TypeScript 컴파일 성공"
else
    echo "❌ TypeScript 컴파일 실패"
    exit 1
fi

# 단위 테스트 실행
echo ""
echo "🔬 단위 테스트 실행..."
echo "----------------------------------"

# pixelUtils 테스트
echo "📊 pixelUtils 테스트..."
npx vitest run __tests__/pixelUtils.test.ts --reporter=verbose
if [ $? -eq 0 ]; then
    echo "✅ pixelUtils 테스트 통과"
else
    echo "❌ pixelUtils 테스트 실패"
    exit 1
fi

# historyUtils 테스트
echo "📚 historyUtils 테스트..."
npx vitest run __tests__/historyUtils.test.ts --reporter=verbose
if [ $? -eq 0 ]; then
    echo "✅ historyUtils 테스트 통과"
else
    echo "❌ historyUtils 테스트 실패"
    exit 1
fi

# pixelFlip 테스트
echo "🔄 pixelFlip 테스트..."
npx vitest run __tests__/pixelFlip.test.ts --reporter=verbose
if [ $? -eq 0 ]; then
    echo "✅ pixelFlip 테스트 통과"
else
    echo "❌ pixelFlip 테스트 실패"
    exit 1
fi

# 통합 테스트 실행
echo ""
echo "🔗 통합 테스트 실행..."
echo "----------------------------------"

# Dotting 컴포넌트 통합 테스트
echo "🎨 Dotting 컴포넌트 통합 테스트..."
npx vitest run __tests__/Dotting.integration.test.tsx --reporter=verbose
if [ $? -eq 0 ]; then
    echo "✅ Dotting 통합 테스트 통과"
else
    echo "❌ Dotting 통합 테스트 실패"
    exit 1
fi

# 전체 테스트 요약
echo ""
echo "🎉 모든 테스트 완료!"
echo "=================================="
echo "✅ TypeScript 컴파일 체크"
echo "✅ pixelUtils 단위 테스트"
echo "✅ historyUtils 단위 테스트"
echo "✅ pixelFlip 단위 테스트"
echo "✅ Dotting 통합 테스트"
echo ""
echo "🚀 픽셀 아트 에디터가 정상적으로 작동합니다!"

# 테스트 커버리지 정보 (선택사항)
echo ""
echo "📊 테스트 커버리지 확인..."
npx vitest run --coverage --reporter=verbose 