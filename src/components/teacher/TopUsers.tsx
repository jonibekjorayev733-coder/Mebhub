import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";

interface User {
  id: number;
  name: string;
  score: number;
  tests_completed: number;
}

export default function TopUsers() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Alisher Usmonov",
      score: 950,
      tests_completed: 15,
    },
    {
      id: 2,
      name: "Zarina Karimova",
      score: 920,
      tests_completed: 14,
    },
    {
      id: 3,
      name: "Jasur Mirzaev",
      score: 890,
      tests_completed: 12,
    },
    {
      id: 4,
      name: "Dilnoza Rakhimova",
      score: 850,
      tests_completed: 11,
    },
    {
      id: 5,
      name: "Bekzod Shukurov",
      score: 800,
      tests_completed: 10,
    },
  ]);

  const medals = [Trophy, Medal, Award];

  return (
    <div className="space-y-4">
      {users.map((user, index) => {
        const Icon = medals[Math.min(index, 2)];
        return (
          <Card
            key={user.id}
            className="bg-black/50 border-white/10 shadow-2xl backdrop-blur-xl hover:border-cyan-500/50 transition-all duration-300"
          >
            <CardContent className="pt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-500/50 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{user.name}</h3>
                  <p className="text-sm text-white/50">
                    {user.tests_completed} ta test yechgan
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {user.score}
                </p>
                <p className="text-xs text-white/50">ball</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
