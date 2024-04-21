import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'; // อย่าลืมเพิ่ม CSS
import 'sweetalert2/dist/sweetalert2.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <ToastContainer />
        <App />
    </Provider>
)
