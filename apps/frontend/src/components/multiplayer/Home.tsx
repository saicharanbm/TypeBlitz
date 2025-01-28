import { useEffect } from "react";
import { Users, CodeXml, User, Users2, Users2Icon } from "lucide-react";
import { PiUsersThreeFill } from "react-icons/pi";

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
    <div className="w-full pt-16  flex gap-4 ">
      <div className="bg-[#2c2e31] py-24 w-full flex flex-col items-center  rounded-lg hover:bg-textPrimary cursor-pointer hover:text-nav">
        {/* <PiUsersThreeFill /> */}
        <Users size={38} strokeWidth={3} />
        Create Room
      </div>
      <div className="bg-[#2c2e31] py-24 w-full flex flex-col items-center  rounded-lg hover:bg-textPrimary cursor-pointer hover:text-nav">
        <CodeXml size={38} strokeWidth={3} />
        Join a Room
      </div>
    </div>
  );
}

export default Home;
