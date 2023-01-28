import React, { ButtonHTMLAttributes } from "react";

type SubmitButtonProps = {
    children: React.ReactNode,
    isSubmitting: boolean,
    buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>
}

const SubmitButton = ({children, isSubmitting, buttonProps} : SubmitButtonProps) => {
  if (isSubmitting) {
    return <div className="flex justify-center items-center">
      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
        <span className="visually-hidden"></span>
      </div>
    </div>;
  }

  return (
    <>
      <button
        disabled={buttonProps?.disabled}
       className={
        `bg-blue-500 hover:bg-blue-600 uppercase text-white tex font-semibold py-2 px-4 border border-blue-300 rounded shadow 
          ${buttonProps?.disabled ? "opacity-50" : ""}` 
        }>
        {children}
      </button>
    </>
  );
};

export default SubmitButton;
