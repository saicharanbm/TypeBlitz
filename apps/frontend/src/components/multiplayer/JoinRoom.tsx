import { useRef, useEffect, useState } from "react";
import { PopupProps } from "../../types";

function JoinRoom({ setIsPopupOpen, userId, wsConnection }: PopupProps) {
  const popupRef = useRef<HTMLFormElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Trigger the transition on mount
    setIsVisible(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false); // Start closing transition
        setTimeout(() => setIsPopupOpen(false), 300); // Wait for transition before unmounting
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsPopupOpen]);

  function joinRoom() {
    if (!roomId.trim()) {
      setError("roomId can't be empty.");
      return;
    }

    if (roomId.trim().length !== 6) {
      setError("roomId should be of length 6");
      return;
    }

    if (!name.trim()) {
      setError("name can't be empty.");
      return;
    }

    wsConnection.send(
      JSON.stringify({
        type: "Join",
        payload: { name, userId, roomId },
      })
    );
  }

  return (
    <div
      className={`fixed left-0 top-0 w-full h-full bg-[rgba(0,0,0,0.75)] flex items-center justify-center z-50 ${
        isVisible ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
    >
      <form
        ref={popupRef}
        className={`main bg-bgColor rounded-lg p-8 grid gap-4 w-64 md:w-72 lg:w-80 transform overflow-hidden break-words ${
          isVisible ? "scale-100" : "scale-95"
        } transition-transform duration-300`}
        onSubmit={(e) => {
          e.preventDefault();
          joinRoom();
        }}
      >
        <div>
          <input
            className="bg-nav w-[100%] leading-5 p-2 rounded-md outline-none caret-primaryColor "
            placeholder="Room Code"
            maxLength={6}
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            className="bg-nav w-[100%] leading-5 p-2 rounded-md outline-none caret-primaryColor "
            placeholder="Name"
            value={name}
            maxLength={8}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="w-full overflow-hidden text-center leading-4">
          {error && <span className="text-incorrect text-sm">{error}</span>}
        </div>

        <button
          type="submit"
          className="button text-center p-1 text-md font-robotoSans bg-nav rounded-md cursor-pointer hover:bg-textPrimary hover:text-nav transition-colors duration-[125ms]"
        >
          Join
        </button>
      </form>
    </div>
  );
}

export default JoinRoom;
