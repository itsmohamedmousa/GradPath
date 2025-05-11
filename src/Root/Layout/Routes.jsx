import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from '../../Pages/Login/Login';
import Layout from './Layout';
import Dashboard from '../../Pages/Dashboard/Dashboard';
import Register from '../../Pages/Register/Register';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
