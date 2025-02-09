function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="45 45 210 110"
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
        fill="#e2b714"
        stroke="#333437"
        strokeWidth="4"
      />

      <g fill="#ffffff" stroke="#333333" strokeWidth="2">
        <rect x="64" y="64" width="45" height="45" rx="5" />
        <rect x="114" y="64" width="20" height="20" rx="5" />
        <rect x="139" y="64" width="20" height="20" rx="5" />
        <rect x="164" y="64" width="20" height="20" rx="5" />
        <rect x="189" y="64" width="20" height="20" rx="5" />
        <rect x="214" y="64" width="20" height="20" rx="5" />

        <rect x="114" y="89" width="20" height="20" rx="5" />
        <rect x="139" y="89" width="20" height="20" rx="5" />
        <rect x="164" y="89" width="20" height="20" rx="5" />

        <rect x="64" y="114" width="20" height="20" rx="5" />
        <rect x="89" y="114" width="20" height="20" rx="5" />
        <rect x="114" y="114" width="20" height="20" rx="5" />
        <rect x="139" y="114" width="20" height="20" rx="5" />
        <rect x="164" y="114" width="20" height="20" rx="5" />

        <rect x="189" y="89" width="45" height="45" rx="5" />
      </g>

      <text
        x="86"
        y="89"
        fontFamily="Arial"
        fontSize="30"
        fontWeight="bold"
        fill="#333333"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        T
      </text>

      <text
        x="211"
        y="114"
        fontFamily="Arial"
        fontSize="30"
        fontWeight="bold"
        fill="#333333"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        B
      </text>
    </svg>
  );
}

export default Icon;
