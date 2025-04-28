const LoginPage = () => {
  return (
    <div className="relative h-[calc(100vh-80px)] w-full bg-gray-50 overflow-hidden flex items-center justify-center">
      {/* Blob Shapes - Soft & Organic */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-300/30 rounded-[60%] blur-md rotate-45"></div>
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-pink-400/20 rounded-[50%] blur-lg rotate-12"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-pink-300/20 rounded-[55%] blur-md rotate-12"></div>

      {/* Login Card */}
      <div className="relative z-10 bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-white/40 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Welcome Back 👋
        </h2>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            type="submit"
            className="w-full bg-pink-500 text-white font-semibold py-2 rounded-md hover:bg-pink-600 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
