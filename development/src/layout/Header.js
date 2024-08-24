let Header = (props) => {
  return (
    <>
      <div className="container mt-3">
        <div className="row">
          <div className="col-sm-12 text-start">
            <p className={`h3 ${props.color}`}>{props.heading}</p>
            <p className="fst-italic">
              Welcome to CatchPhis, your ultimate tool for safeguarding against
              online threats. Our advanced web app analyzes and predicts
              phishing risks for any website, helping you stay one step ahead of
              cyber threats and protect your sensitive information with
              confidence.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
