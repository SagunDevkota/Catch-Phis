let ErrorMessage = (props) => {
  return (
    <>
      <div className="container mt-3">
        <div className="row">
          <div className="col">
            {/* <p className="h3 text-danger">{props.message}</p> */}
            <div className="alert alert-danger" role="alert">{props.message}</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ErrorMessage;
