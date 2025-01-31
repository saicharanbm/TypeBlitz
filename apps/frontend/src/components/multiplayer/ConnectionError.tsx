import { Link } from "react-router-dom";
import { ConnectionErrorProps } from "../../types";

function ConnectionError({
  reloadCount,
  setReloadCount,
}: ConnectionErrorProps) {
  return (
    <div className="w-full p-28 flex flex-col items-center justify-center">
      {reloadCount < 4 ? (
        <>
          <p>Failed to connect to the WebSocket server. Retrying...</p>
          <button
            onClick={() => setReloadCount((prev) => prev + 1)}
            className="mt-4 px-4 py-2 bg-nav rounded-lg hover:bg-textPrimary hover:text-nav transition"
          >
            Reload Page
          </button>
        </>
      ) : (
        <>
          <p className="text-incorrect">
            Something went wrong. Please try again later.
          </p>
          <Link
            className="mt-4 px-4 py-2 bg-nav rounded-lg hover:bg-textPrimary hover:text-nav transition"
            to="/"
          >
            Home
          </Link>
        </>
      )}
    </div>
  );
}

export default ConnectionError;
