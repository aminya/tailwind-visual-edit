export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
        Find Your Dream Home
      </h1>
      <p className="text-lg text-gray-500 max-w-2xl text-center leading-relaxed">
        The easiest way to buy and sell properties. Discover thousands of
        homes and connect with trusted agents.
      </p>
      <div className="flex gap-4 mt-8">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md font-medium hover:bg-blue-700 transition duration-200 cursor-pointer">
          Browse Homes
        </button>
        <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
          List your property
        </button>
      </div>
      <div className="grid grid-cols-3 gap-8 mt-16">
        <div className="p-6 text-center border rounded-xl shadow-sm">
          <span className="text-3xl font-extrabold text-blue-600">10,000+</span>
          <p className="text-sm text-gray-500 mt-2">Properties listed</p>
        </div>
        <div className="p-6 text-center border rounded-xl shadow-sm">
          <span className="text-3xl font-extrabold text-blue-600">5,000+</span>
          <p className="text-sm text-gray-500 mt-2">Happy customers</p>
        </div>
        <div className="p-6 text-center border rounded-xl shadow-sm">
          <span className="text-3xl font-extrabold text-blue-600">400+</span>
          <p className="text-sm text-gray-500 mt-2">Expert agents</p>
        </div>
      </div>
    </div>
  );
}
