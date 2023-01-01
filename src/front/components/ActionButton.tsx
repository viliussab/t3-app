import React from "react";

type ActionButtonProps = {
    children: React.ReactNode,
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    color?: "default" | "pdf" | "altAction" | "danger"
}

const ActionButton = (props : ActionButtonProps) => {

  const {onClick, color, children} = props;

  const getColorClasses = () => {
    if (color === "pdf") {
      return "bg-purple-500 hover:bg-purple-600 text-gray-100 border-purple-400 hover:text-white";
    }

    if (color === "altAction") {
      return "bg-cyan-500 hover:bg-cyan-600 text-gray-100 border-cyan-500 hover:text-white";
    }

    if (color === "danger") {
      return "bg-rose-700 hover:bg-rose-800 text-gray-100 border-rose-600 hover:text-white";
    }

    if (color === "default" || !color) {
      return "bg-gray-100 hover:bg-white text-blue-500 hover:text-blue-600 border-grey-300";
    }
  };

  return (
    <>
      <button
        onClick={onClick}
        className={`${getColorClasses()} font-semibold py-2 px-4 border rounded shadow`}>
        {children}
      </button>
    </>
  );
};

export default ActionButton;
