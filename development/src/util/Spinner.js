import spinnerImage from '../assets/spinner.gif';

let Spinner = () => {
    return (
        <>
            <div className="spinner">
                <div className="d-flex flex-column justify-content-center align-items-center h-100">
                    <img src={spinnerImage} alt="" className="d-block m-auto"/>
                </div>
            </div>
        </>
    )
};
export default Spinner;