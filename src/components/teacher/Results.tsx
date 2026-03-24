import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface Result {
  id: number;
  test_title: string;
  student_name: string;
  score: number;
  total: number;
  completed_at: string;
}

export default function Results() {
  const [results] = useState<Result[]>([
    {
      id: 1,
      test_title: "O'zbekiston Geografiyasi",
      student_name: "Alisher Usmonov",
      score: 95,
      total: 100,
      completed_at: "2024-03-20",
    },
    {
      id: 2,
      test_title: "Tarix Asoslari",
      student_name: "Zarina Karimova",
      score: 92,
      total: 100,
      completed_at: "2024-03-19",
    },
    {
      id: 3,
      test_title: "O'zbekiston Geografiyasi",
      student_name: "Jasur Mirzaev",
      score: 89,
      total: 100,
      completed_at: "2024-03-18",
    },
  ]);

  return (
    <div className="space-y-4">
      {results.length === 0 ? (
        <Card className="bg-black/50 border-white/10 shadow-2xl backdrop-blur-xl text-center py-12">
          <CardContent>
            <BarChart3 className="w-12 h-12 mx-auto text-white/40 mb-4" />
            <p className="text-white/60">Hozircha natijalar yo'q</p>
          </CardContent>
        </Card>
      ) : (
        results.map((result) => {
          const percentage = (result.score / result.total) * 100;
          return (
            <Card
              key={result.id}
              className="bg-black/50 border-white/10 shadow-2xl backdrop-blur-xl hover:border-cyan-500/50 transition-all duration-300"
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {result.test_title}
                    </h3>
                    <p className="text-sm text-white/50">{result.student_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-400">
                      {result.score}/{result.total}
                    </p>
                    <p className="text-sm text-white/50">
                      {new Date(result.completed_at).toLocaleDateString("uz-UZ")}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      percentage >= 80
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : percentage >= 60
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : "bg-gradient-to-r from-red-500 to-pink-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <p className="text-xs text-white/50 mt-2 text-right">
                  {percentage.toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
