import React, { useState } from "react";



const Channel = () => {

    const [isExpanded1, setIsExpanded1] = useState(false);
    const [isExpanded2, setIsExpanded2] = useState(false);
    const [isExpanded3, setIsExpanded3] = useState(false);

    const toggleAccordion1 = () => {
      setIsExpanded1(!isExpanded1);
    };
    const toggleAccordion2 = () => {
      setIsExpanded2(!isExpanded2);
    };
    const toggleAccordion3 = () => {
      setIsExpanded3(!isExpanded3);
    };
    return (
    <div className="bg-[#aeaaaa] w-40 h-[100%] pt-[2.5%] pb-[2.5%] flex p-4 flex-col text-blue-50">
    
        {/* Channel 1 */}
    <div
        className="bg-[#36393F] mb-2 p-2 rounded-lg"
        onClick={toggleAccordion1}
      >
      Channel 1
      </div>
      <div className={`bg-[#202225] p-2 ${isExpanded1 ? 'block' : 'hidden'}`}>
        Accordion Content
      </div>
    {/* Channel 2 */}
    <div
        className="bg-[#36393F] mb-2 p-2 rounded-lg"
        onClick={toggleAccordion2}
        >
      Channel 2
      </div>
      <div className={`bg-[#202225] p-2 ${isExpanded2 ? 'block' : 'hidden'}`}>
        Accordion Content
      </div>
          {/* Channel 3 */}
    <div
        className="bg-[#36393F] mb-2 p-2  rounded-lg"
        onClick={toggleAccordion3}
      >
      Channel 3
      </div>
      <div className={`bg-[#202225] p-2 ${isExpanded3 ? 'block' : 'hidden'}`}>
        Accordion Content
      </div>
     

    </div>
  );
};

export default Channel;
