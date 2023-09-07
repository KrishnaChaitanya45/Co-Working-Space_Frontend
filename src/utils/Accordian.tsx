import React from "react";

const AccordionContext = React.createContext({});
export const useAccordion = () => React.useContext(AccordionContext);

export function Accordion({
  children,
  multiple,
  defaultIndex,
}: {
  children: any;
  multiple: any;
  defaultIndex: any;
}) {
  //SINGLE - 0,1,2
  //MULTIPLE - ARRAY OF INDEXES
  const [activeIndex, setActiveIndex] = React.useState(
    multiple ? [defaultIndex] : defaultIndex
  );

  function onChangeIndex(index: number) {
    setActiveIndex((currentActiveIndex: any) => {
      if (!multiple) {
        return index === currentActiveIndex ? -1 : index;
      }
      // 1 --> -1, -1 --> 1
      //[1,2,3] ==> 2 CLICK ==> [1,3]
      if (currentActiveIndex.includes(index)) {
        return currentActiveIndex.filter((i: number) => i !== index);
      }

      return currentActiveIndex.concat(index);
    });
  }

  return React.Children.map(children, (child, index) => {
    const isActive =
      multiple && Array.isArray(activeIndex)
        ? activeIndex.includes(index)
        : activeIndex === index;

    return (
      <AccordionContext.Provider value={{ isActive, index, onChangeIndex }}>
        {child}
      </AccordionContext.Provider>
    );
  });
}
