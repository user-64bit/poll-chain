export const dummyPolls: any[] = [
  {
    id: "1",
    title: "Favorite Programming Language",
    totalVotes: 1500,
    startDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-1`,
    endDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-28`,
    options: [
      { label: "JavaScript", votes: 600, color: "bg-yellow-500" },
      { label: "Python", votes: 450, color: "bg-blue-500" },
      { label: "Java", votes: 300, color: "bg-red-500" },
      { label: "C++", votes: 150, color: "bg-green-500" },
    ],
  },
  {
    id: "2",
    title: "Preferred Development Environment",
    totalVotes: 1200,
    startDate: `${new Date().getFullYear() + 1}-${
      (new Date().getMonth() + 2) % 12
    }-1`,
    endDate: `${new Date().getFullYear() + 1}-${
      (new Date().getMonth() + 3) % 12
    }-28`,
    options: [
      { label: "VS Code", votes: 500, color: "bg-blue-500" },
      { label: "IntelliJ IDEA", votes: 350, color: "bg-orange-500" },
      { label: "Sublime Text", votes: 200, color: "bg-yellow-500" },
      { label: "Vim", votes: 150, color: "bg-green-500" },
    ],
  },
];
