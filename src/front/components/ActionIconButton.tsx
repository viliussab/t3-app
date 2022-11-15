import React from "react";

type ActionButtonProps = {
    children: React.ReactNode,
    isSubmitting: boolean,
}

const SubmitButton = (props : ActionButtonProps) => {
  if (props.isSubmitting) {
    return <div className="flex justify-center items-center">
      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  return (
    <>
      <button className="bg-blue-700 hover:bg-blue-800 uppercase text-white tex font-semibold py-2 px-4 border border-blue-300 rounded-lg shadow">
        {props.children}
      </button>
    </>
  );
};

export default SubmitButton;
