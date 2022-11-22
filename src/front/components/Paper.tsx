import React from "react";

type PaperProps = {
    children: React.ReactNode
    className: string
}

const Paper = (props : PaperProps) => {
  return (
    <>
      <div className={`shadow-md hover:shadow-lg ${props.className}`}>
        {props.children}
      </div>
  
    </>
  );
};

export default Paper;
