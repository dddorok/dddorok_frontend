import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SvgMappingForm() {
  const [selectedMeasurements, setSelectedMeasurements] = useState({
    "앞품길이": true,
    "어깨끝점거리": true,
    "어깨사선길이": true,
    "진동길이": false,
    "허리길이": false
  });

  const [selectedPath, setSelectedPath] = useState("");
  
  // 샘플 SVG 경로 데이터
  const svgPaths = [
    { id: "BODY_FRONT_NECK_WIDTH", name: "BODY_FRONT_NECK_WIDTH", selected: false },
    { id: "BODY_SHOULDER_SLOPE_LENGTH", name: "BODY_SHOULDER_SLOPE_LENGTH", selected: false },
    { id: "BODY_SHOULDER_SLOPE_WIDTH", name: "BODY_SHOULDER_SLOPE_WIDTH", selected: false },
    { id: "BODY_WAIST_LENGTH", name: "BODY_WAIST_LENGTH", selected: false }
  ];

  const toggleMeasurement = (key) => {
    setSelectedMeasurements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Step 2. SVG 영역과 매핑</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 왼쪽 SVG 미리보기 패널 */}
        <div className="space-y-4">
          <Card className="p-4 border h-72 flex items-center justify-center">
            <div className="w-full h-full relative">
              <div className="text-lg font-medium absolute top-2 left-4">미리보기 패널</div>
              
              {/* SVG 미리보기 */}
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* 간단한 인체 라인 그리기 */}
                <g stroke="#000" fill="none" strokeWidth="1.5">
                  {/* 목 라인 */}
                  <path d="M100,50 C110,50 120,55 120,65" />
                  
                  {/* 어깨 라인 - 왼쪽 */}
                  <path d="M120,65 L140,75" strokeWidth="2" stroke={selectedPath === "BODY_SHOULDER_SLOPE_LENGTH" ? "#f00" : "#000"}>
                    <circle cx="120" cy="65" r="3" fill="white" stroke="black" strokeWidth="1" />
                    <circle cx="140" cy="75" r="3" fill="white" stroke="black" strokeWidth="1" />
                  </path>
                  
                  {/* 몸통 라인 - 왼쪽 */}
                  <path d="M140,75 L150,120" />
                  
                  {/* 허리 라인 */}
                  <path d="M90,120 L150,120">
                    <circle cx="90" cy="120" r="3" fill="white" stroke="black" strokeWidth="1" />
                    <circle cx="150" cy="120" r="3" fill="white" stroke="black" strokeWidth="1" />
                  </path>
                  
                  {/* 허리 아래 라인 */}
                  <path d="M90,140 L150,140">
                    <circle cx="90" cy="140" r="3" fill="white" stroke="black" strokeWidth="1" />
                    <circle cx="150" cy="140" r="3" fill="white" stroke="black" strokeWidth="1" />
                  </path>
                </g>
              </svg>
            </div>
          </Card>

          {/* 파일 업로드 버튼 */}
          <div>
            <Button variant="outline" className="w-full">파일 업로드 영역 (알파벳 .svg)</Button>
          </div>

          {/* Path ID 리스트 */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Path ID</div>
            {svgPaths.map((path, index) => (
              <div key={path.id} className="flex items-center space-x-2 ml-4">
                <div className="text-gray-500">{index + 1}</div>
                <div className={`flex-1 ${selectedPath === path.id ? "font-medium" : ""}`} 
                     onClick={() => setSelectedPath(path.id)}
                     style={{ cursor: 'pointer' }}>
                  {path.name} →
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 측정항목 패널 */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base">측정항목</Label>
            <div className="space-y-2">
              {Object.entries(selectedMeasurements).map(([key, checked]) => (
                <div key={key} className="flex items-start space-x-2">
                  <Checkbox 
                    id={key} 
                    checked={checked} 
                    onCheckedChange={() => toggleMeasurement(key)}
                  />
                  <Label 
                    htmlFor={key} 
                    className="text-sm cursor-pointer"
                  >
                    {key}
                  </Label>
                  {key === "앞품길이" && (
                    <span className="text-xs text-gray-500 ml-2">
                      ← 선택 불가 (이대로 놔두세요)
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-sm text-gray-500 mt-4">
              필터타입, 디자인 유형... 바뀌는<br />
              파라미터
            </div>
          </div>

          {/* 측정 항목 선택 리스트 */}
          <div className="space-y-3 mt-6">
            <Input value="앞품길이" readOnly className="bg-gray-100" />
            <Input value="어깨끝점거리" readOnly className="bg-gray-100" />
            <Input value="어깨사선길이" readOnly className="bg-gray-100" />
            
            {/* 경고 메시지가 포함된 입력 필드 */}
            <div className="relative">
              <Input 
                value="어깨사선 잘못 측정됨" 
                readOnly 
                className="pr-10 border-red-500 bg-red-50 text-red-600"
              />
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
            </div>

            <div className="text-sm text-gray-500 text-center mt-2">
              <span className="block">↑</span>
              <span>매핑시 잘못 측정 원인가 제일 안안하게할</span>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end space-x-3 mt-10">
            <Button variant="outline">취소</Button>
            <Button>저장</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
