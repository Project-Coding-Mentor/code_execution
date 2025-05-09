import { javascript } from "@codemirror/lang-javascript";
import { Card, CardContent } from "@/components/ui/card";
interface QuestionProps {
  title: string;
  description: string;
}

function Question({ title, description }: QuestionProps) {
  return (
    <Card className="bg-black flex-1 relative left-0 border-none rounded-none">
      <CardContent>
        <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
        <p className="text-white">{description.split("\n").map((line, index) => <span key={index}>{line}<br /></span>)}</p>

      </CardContent>
    </Card>
  );
}

export default Question;
