const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full fixed top-0 right-0 bg-black/20">
      <div>
        <span className="loading loading-ring loading-lg"></span>
      </div>
    </div>
  );
};

export default Loading;
