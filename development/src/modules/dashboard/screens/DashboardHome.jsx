import Header from "../../../layout/Header";

const DashboardHome = () => {
  return (
    <>
      <Header heading={'Home'} color={'text-success'} />
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-3">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laboriosam, nobis inventore. Quaerat, id nostrum veritatis
              nesciunt numquam nisi itaque aliquam?
            </p>
          </div>
          <div className="col-sm-3">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laboriosam, nobis inventore. Quaerat, id nostrum veritatis
              nesciunt numquam nisi itaque aliquam?
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
