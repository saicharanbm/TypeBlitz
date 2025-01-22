function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="50 50 200 100"
      width="100%"
      height="auto"
      preserveAspectRatio="none"
    >
      <rect
        x="50"
        y="50"
        width="200"
        height="100"
        rx="15"
        fill="#e0e0e0"
        stroke="#333333"
        stroke-width="4"
      />

      <g fill="#ffffff" stroke="#333333" stroke-width="2">
        <rect x="60" y="60" width="45" height="45" rx="5" />
        <rect x="110" y="60" width="20" height="20" rx="5" />
        <rect x="135" y="60" width="20" height="20" rx="5" />
        <rect x="160" y="60" width="20" height="20" rx="5" />
        <rect x="185" y="60" width="20" height="20" rx="5" />
        <rect x="210" y="60" width="20" height="20" rx="5" />

        <rect x="110" y="85" width="20" height="20" rx="5" />
        <rect x="135" y="85" width="20" height="20" rx="5" />
        <rect x="160" y="85" width="20" height="20" rx="5" />

        <rect x="60" y="110" width="20" height="20" rx="5" />
        <rect x="85" y="110" width="20" height="20" rx="5" />
        <rect x="110" y="110" width="20" height="20" rx="5" />
        <rect x="135" y="110" width="20" height="20" rx="5" />
        <rect x="160" y="110" width="20" height="20" rx="5" />

        <rect x="185" y="85" width="45" height="45" rx="5" />
      </g>

      <text
        x="82"
        y="85"
        font-family="Arial"
        font-size="30"
        font-weight="bold"
        fill="#333333"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        T
      </text>

      <text
        x="207"
        y="110"
        font-family="Arial"
        font-size="30"
        font-weight="bold"
        fill="#333333"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        B
      </text>
    </svg>
  );
}

export default Icon;
