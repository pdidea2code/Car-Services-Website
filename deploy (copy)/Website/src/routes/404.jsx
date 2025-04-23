import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{ color: "var(--color1)" }}
      className="text-center zen-dots mt-5 mb-5 flex flex-col items-center justify-center h-screen"
    >
      <h1 className="text-4xl font-bold text-red-600">404</h1>
      <p className="text-xl">Page Not Found</p>
      <Link to="/" className="mt-4 px-4 py-2">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
