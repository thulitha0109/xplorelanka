export default function GlobalTourPlannerApp() {
  const features = [
    {
      title: 'Smart Tour Planning',
      desc: 'Travelers can plan day tours, weekly adventures, or monthly travel journeys with AI-powered recommendations.',
    },
    {
      title: 'Live Vehicle Tracking',
      desc: 'Drivers can update arrival times, routes, pickup status, and traveler locations in real time.',
    },
    {
      title: 'Nearby Experiences',
      desc: 'Discover waterfalls, hiking trails, hidden cafes, eco stays, and local events near each destination.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black p-10">
      <h1 className="text-5xl font-black">
        Prince Global Travel Planner 🌍
      </h1>

      <p className="mt-4 text-lg text-gray-600 max-w-3xl">
        A smart tourism ecosystem starting from Prince Place Cabins.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="rounded-3xl border p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold">{feature.title}</h2>
            <p className="mt-3 text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
