import Header from '../../../layout/Header';

const DashboardHome = () => {
  return (
    <>
      <Header heading={'Home'} color={'text-success'} />
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-6">
            <p>
              Introducing CatchPhis, the cutting-edge solution for identifying
              and forecasting phishing threats. Our web app empowers you with
              real-time insights into website security, ensuring you can
              navigate online spaces with greater assurance.
            </p>
          </div>
          <div className="col-sm-6">
            <p>
              Meet CatchPhis, your proactive defense against phishing scams.
              With our intuitive web app, you can easily evaluate and anticipate
              the risk levels of any website, giving you the tools to safeguard
              your online activities effectively.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
