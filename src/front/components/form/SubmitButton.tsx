import React, { ButtonHTMLAttributes } from "react";

type SubmitButtonProps = {
  children: React.ReactNode;
  isSubmitting: boolean;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
};

const SubmitButton = ({
  children,
  isSubmitting,
  buttonProps,
}: SubmitButtonProps) => {
  if (isSubmitting) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4"
          role="status"
        >
          <span className="visually-hidden"></span>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        disabled={buttonProps?.disabled}
        className={`tex rounded border border-blue-300 bg-blue-500 py-2 px-4 font-semibold uppercase text-white shadow hover:bg-blue-600 
          ${buttonProps?.disabled ? "opacity-50" : ""}`}
      >
        {children}
      </button>
    </>
  );
};

export default SubmitButton;
