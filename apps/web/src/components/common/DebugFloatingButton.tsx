import { Button } from "@/components/ui/button";
import { useDevStore } from "@/stores/debug";

export default function DebugFloatingButton() {
  const { isDebug, setDebug } = useDevStore();

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        color={isDebug ? "fill" : "default"}
        onClick={() => setDebug(!isDebug)}
        className="shadow-lg"
      >
        {isDebug ? "디버깅 모드 ON" : "디버깅 모드 OFF"}
      </Button>
    </div>
  );
}
