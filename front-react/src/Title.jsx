import { useTranslation } from "react-i18next";

function Title()
{
	const {t} = useTranslation();
	const title_style = {
    	backgroundClip: 'text',
    	WebkitBackgroundClip: 'text', // WebKit browsers support
    	backgroundColor: 'transparent',
    	color: 'transparent',
    	backgroundImage: 'linear-gradient(to bottom, #ff00a0,  #ff911a)',
    	fontFamily: 'cyber5',
    	fontSize: '500%',
    };

	return (
	<div className="d-flex justify-content-center">
        <p style={title_style}>
          {t('title')}
        </p>
      </div>
  );

}

export default Title