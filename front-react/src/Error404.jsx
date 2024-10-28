import { useState } from "react";
import { useRouteError } from "react-router";
import { useTranslation } from 'react-i18next';

function Error404()
{
    const [count, setCount] = useState(0);
    const error = useRouteError();
    const { t } = useTranslation();
    
    console.log(error);
    return(
    <>
        <div className="position-absolute top-50 start-50 btn btn-primary" type="button">
            <button onClick={() => setCount(count => count + 1)}>
            {t('error404')}{count}
            </button>
        </div>
    </>
    );
};

export default Error404