import { useRef, useEffect, useState } from "react";
import { PopupProps } from "../../types";
function CreateRoom({ setIsPopupOpen, userId, wsConnection }: PopupProps) {
  const popupRef = useRef<HTMLFormElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    //Set focus on input box
    if (popupRef.current) {
      const inputElement = popupRef.current.querySelector("input");
      if (inputElement) {
        (inputElement as HTMLInputElement).focus(); // Focus the input field
      }
    }
  }, []);

  useEffect(() => {
    // Trigger the transition on mount
    setIsVisible(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
        setTimeout(() => setIsPopupOpen(false), 300);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsPopupOpen]);

  function createRoom() {
    if (!name.trim()) {
      setError("name can't be empty.");
      return;
    }
    wsConnection.send(
      JSON.stringify({
        type: "Create",
        payload: { name, userId: userId },
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
        className={`main bg-bgColor rounded-lg p-8 grid gap-4 w-64 md:w-72 lg:w-80 transform ${
          isVisible ? "scale-100" : "scale-95"
        } transition-transform duration-300`}
        onSubmit={(e) => {
          e.preventDefault();
          createRoom();
        }}
      >
        <div>
          <input
            type="text"
            className="bg-nav w-[100%] leading-5 p-2 rounded-md outline-none caret-primaryColor "
            placeholder="Name"
            onChange={(e) => {
              if (error) setError("");
              setName(e.target.value);
            }}
            value={name}
            maxLength={8}
          />
        </div>
        <div className="w-full overflow-hidden text-center leading-4">
          {error && <span className="text-incorrect text-sm">{error}</span>}
        </div>
        <button
          className="button text-center p-1 text-md font-robotoSans bg-nav rounded-md cursor-pointer hover:bg-textPrimary hover:text-nav transition-colors duration-[125ms]"
          type="submit"
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateRoom;
