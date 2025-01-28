import React, { useRef, useEffect, useState } from "react";

interface PopupProps {
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function JoinGroup({ setIsPopupOpen }: PopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <div
      className={`fixed left-0 top-0 w-full h-full bg-[rgba(0,0,0,0.75)] flex items-center justify-center z-50 ${
        isVisible ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
    >
      <div
        ref={popupRef}
        className={`main bg-bgColor rounded-lg p-8 grid gap-4 w-64 md:w-72 lg:w-80 transform ${
          isVisible ? "scale-100" : "scale-95"
        } transition-transform duration-300`}
      >
        <div>
          <input
            type="number"
            className="bg-nav w-[100%] leading-5 p-2 rounded-md outline-none caret-primaryColor "
            placeholder="Room Code"
          />
        </div>
        <div>
          <input
            type="text"
            className="bg-nav w-[100%] leading-5 p-2 rounded-md outline-none caret-primaryColor "
            placeholder="Name"
          />
        </div>
        <div className="button text-center p-1 text-md font-robotoSans bg-nav rounded-md cursor-pointer hover:bg-textPrimary hover:text-nav transition-colors duration-[125ms]">
          Join
        </div>
      </div>
    </div>
  );
}

export default JoinGroup;
