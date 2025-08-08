import React, { useState } from "react";
import { Pencil } from "lucide-react";

const HoroscopeSection = () => {
  const [generated, setGenerated] = useState(false);
  const [horoscopeData, setHoroscopeData] = useState<any>(null);

  const generateHoroscope = () => {
    const mockResponse = {
      compatibility: "85%",
      luckyNumbers: [3, 7, 21, 33],
      luckyColors: ["Blue", "Green", "Yellow"],
      favorableTime: "Morning 6–8 AM",
      message:
        "This is a favorable time for new beginnings and relationships.",
    };
    setHoroscopeData(mockResponse);
    setGenerated(true);
  };

  return (
    <div className="bg-white rounded-xl shadow border p-6 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-gray-800">Horoscope</h2>
        <Pencil className="h-4 w-4 text-gray-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 text-sm text-gray-700 mb-4">
        <p><strong>Date of Birth:</strong> 7/3/1993</p>
        <p><strong>Time of Birth:</strong> 23:50</p>
        <p><strong>Birth Place:</strong> Mahbubnagar, Telangana</p>
        <p><strong>Chart Style:</strong> South Indian</p>
        <p><strong>Language:</strong> Telugu</p>
      </div>

      {!generated ? (
<div className="bg-yellow-400 rounded-xl p-4 flex flex-col gap-2">
  <p className="text-black text-sm">
    Generate your horoscope and get more responses
  </p>
  <button
    className="bg-white text-yellow-600 font-semibold text-sm px-4 py-2 rounded-lg self-start whitespace-nowrap"
  >
    GENERATE HOROSCOPE
  </button>
</div>
      ) : (
        <div className="mt-4 bg-green-100 border border-green-300 rounded-lg p-5 text-sm text-gray-800 space-y-2">
          <p className="text-green-700 font-semibold mb-2">
            Horoscope Generated Successfully!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p>
              <strong>Compatibility:</strong>{" "}
              <span className="text-green-700 font-semibold">
                {horoscopeData.compatibility}
              </span>
            </p>
            <p>
              <strong>Lucky Numbers:</strong>{" "}
              {horoscopeData.luckyNumbers.join(", ")}
            </p>
            <p>
              <strong>Lucky Colors:</strong>{" "}
              {horoscopeData.luckyColors.join(", ")}
            </p>
            <p>
              <strong>Favorable Time:</strong> {horoscopeData.favorableTime}
            </p>
          </div>
          <p>{horoscopeData.message}</p>
        </div>
      )}
    </div>
  );
};

export default HoroscopeSection;
