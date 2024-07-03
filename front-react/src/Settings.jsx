import { useParams } from "react-router";

function Settings()
{
    const {id} = useParams()

    return <div>
        <h1>ID of {id}</h1>
    </div>
};

export default Settings
