import React from "react";

type ActionButtonProps = {
    children: React.ReactNode,
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

const ActionButton = (props : ActionButtonProps) => {
  return (
    <>
      <button
        onClick={props.onClick}
        className="bg-gray-100 hover:bg-white uppercase text-blue-500 hover:text-blue-600 font-semibold py-2 px-4 border border-gray-300 rounded shadow">
        {props.children}
      </button>
    </>
  );
};

export default ActionButton;
