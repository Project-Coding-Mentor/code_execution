import { javascript } from "@codemirror/lang-javascript";
import { Card, CardContent } from "@/components/ui/card";
interface QuestionProps {
  question: string;
}

function Question({ question }: QuestionProps) {
    return (
        <Card className="bg-black flex-1 relative left-0 border-none rounded-none">
    <CardContent>
      <h2 className="text-lg font-bold text-white mb-2">Question</h2>
      <p className="text-white">{question}</p>
    </CardContent>
  </Card>
    );
}
export default Question;