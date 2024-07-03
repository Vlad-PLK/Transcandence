import { useRouteError } from "react-router";

function Error404()
{
    const error = useRouteError()
    console.log(error);
    return(
    <>
        <div className="position-absolute top-50 start-50 btn btn-primary" type="button">Error 404</div>
    </>
    );
};

export default Error404