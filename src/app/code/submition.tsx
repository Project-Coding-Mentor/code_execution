import { Card, CardContent } from "@/components/ui/card";

interface SubmitionProps {
  submissions: string[]; // Accept a list of submissions as a prop
}

function Submition({ submissions }: SubmitionProps) {
  return (
    <Card className="bg-black text-white p-4">
      <CardContent>
        <h2 className="text-lg font-bold mb-4">Your Submissions</h2>
        {submissions.length > 0 ? (
          <ul className="space-y-4">
            {submissions.map((submission, index) => (
              <li key={index} className="bg-gray-800 p-4 rounded text-white whitespace-pre-wrap">
                <h3 className="text-sm font-semibold mb-2">Submission {index + 1}:</h3>
                <pre>{submission}</pre>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No submissions yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default Submition;