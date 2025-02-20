import React from "react";

const SpinningGradientCircle = () => {
  return (
    <div className="inline-flex items-center justify-center mr-2">
      <div className="p-1 bg-gradient-to-tr from-[#06010D] to-[#15DBB9] rounded-full animate-spin">
        <div className="bg-white rounded-full">
          <div className="w-4 h-4 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SpinningGradientCircle;