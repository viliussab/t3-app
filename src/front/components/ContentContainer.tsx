import React from "react";

type ContentContainerProps = {
    children: React.ReactNode
    className: string
}

const ContentContainer = (props : ContentContainerProps) => {
  return (
    <>
      <div className={`shadow-md hover:shadow-lg ${props.className}`}>
        {props.children}
      </div>
  
    </>
  );
};

export default ContentContainer;
