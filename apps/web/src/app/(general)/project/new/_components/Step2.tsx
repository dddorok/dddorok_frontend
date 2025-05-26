import { SliderSection } from "./korean-slider-component";

export default function Step2() {
  return (
    <div>
      <div className="w-full max-w-5xl mx-auto p-8 bg-gray-50 min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <SliderSection
            label="E 소매길이"
            min={45}
            max={55}
            snapValues={[45, 47, 50, 51, 52, 54, 55]}
            initialValue={50}
            average={47}
          />

          <SliderSection
            label="F 소매너비"
            min={15}
            max={19}
            snapValues={[15, 16, 17, 18, 19]}
            initialValue={17}
            average={18}
          />

          <SliderSection
            label="G 손목너비"
            min={6}
            max={10}
            snapValues={[6, 7, 8, 9, 10]}
            initialValue={7}
            leftLabel="짧음"
            rightLabel="여유있음"
            average={8}
          />
        </div>
      </div>{" "}
    </div>
  );
}
