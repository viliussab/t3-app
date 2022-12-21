import React from "react";

type SubmitButtonProps = {
    children: React.ReactNode,
    isSubmitting: boolean,
}

const SubmitButton = (props : SubmitButtonProps) => {
  if (props.isSubmitting) {
    return <div className="flex justify-center items-center">
      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
        <span className="visually-hidden"></span>
      </div>
    </div>;
  }

  return (
    <>
      <button className="bg-blue-500 hover:bg-blue-600 uppercase text-white tex font-semibold py-2 px-4 border border-blue-300 rounded shadow">
        {props.children}
      </button>
    </>
  );
};

export default SubmitButton;
