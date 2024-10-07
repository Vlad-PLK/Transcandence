import { useTranslation } from "react-i18next"

function TranslationSelect()
{
	const {i18n: {changeLanguage, language} } = useTranslation();
	const handleLanguageChange = (event) => {
		const selectedLang = event.target.value;
		localStorage.setItem("language", selectedLang);
		changeLanguage(selectedLang);
	};

	return (
		<ul className="nav col-sm-auto mb-2 justify-content-center mb-md-0">
            <select className="form-select form-select-sm" id="language-selector" aria-label="language" defaultValue={language} onChange={handleLanguageChange}>
              <option value="en">EN</option>
              <option value="ru">RU</option>
              <option value="fr">FR</option>
            </select>
        </ul>
	);
};

export default TranslationSelect