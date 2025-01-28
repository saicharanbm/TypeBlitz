import { useEffect } from "react";
import { Users } from "lucide-react";

function Home() {
  useEffect(() => {
    // Replace with your WebSocket server URL
    const ws = new WebSocket("wss://localhost:3001");

    // Event listener for incoming messages
    ws.onmessage = (event) => {
      console.log(event);
    };

    // Event listener for errors
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Event listener for connection open
    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    // Event listener for connection close
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="w-full pt-16 h-full flex justify-around ">
      <div className="bg-[#2c2e31]">
        <Users />
        Join a Room
      </div>
      <div>Create Room</div>
    </div>
  );
}

export default Home;
