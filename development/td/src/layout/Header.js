let Header = (props) => {
  return (
    <>
      <div className="container mt-3">
        <div className="row">
          <div className="col-sm-6 text-start">
            <p className={`h3 ${props.color}`}>{props.heading}</p>
            <p className="fst-italic">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. A
              accusantium distinctio eligendi expedita illo ipsa iste mollitia
              necessitatibus
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
