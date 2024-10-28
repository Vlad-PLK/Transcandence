import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './Routing'
import "./i18n"
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

ReactDOM.createRoot(document.getElementById('main_id')).render(
  //<React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <RouterProvider router={router}/>
    </I18nextProvider>
  //</React.StrictMode>,
)