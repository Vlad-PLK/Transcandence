import { useParams } from "react-router";

function Settings()
{
    const {id} = useParams()

    return <div>
        <h1>User id : {id}</h1>
    </div>
};

export default Settings
