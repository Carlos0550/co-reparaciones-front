import { Routes, Route, useNavigate } from "react-router-dom"
import Login from "./Admin/pages/Auth/Login"
import "./App.css"
import Register from "./Admin/pages/Auth/Register"
import Dashboard from "./Admin/pages/Dashboard/Dashboard"
import LayoutComponent from "./Components/Layout/Layout"
import ProductsManager from "./Admin/pages/ProductManager/ProductsManager"
import ClientsManager from "./Admin/pages/Clients/ClientsManager"
import PromotionsManager from "./Admin/pages/Promotions/PromotionsManager"
import PrincipalManager from "./Admin/pages/Principal/PrincipalManager"
import SettingsManager from "./Admin/pages/Settings/SettingsManager"
import ClientLayout from "./Clients/ClientLayout/ClientLayout"
import LoginClient from "./Clients/ClientAuth/LoginClient"
function App() {
  return (
    <Routes>
       {/* Rutas para los clientes */}
      <Route path="/*" element={<ClientLayout/>}/>
      <Route path="/login-client" element={<LoginClient/>}/>
      {/* Rutas de administrador */}
      <Route path="/login-admin" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/admin-dashboard" element={<LayoutComponent component={<Dashboard/>}/>}/>
      <Route path="/admin-manage-products" element={<LayoutComponent component={<ProductsManager/>}/>}/>
      <Route path="/admin-manage-clients" element={<LayoutComponent component={<ClientsManager/>}/>}/>
      <Route path="/admin-manage-promotions" element={<LayoutComponent component={<PromotionsManager/>}/>}/>
      <Route path="/admin-manage-principal" element={<LayoutComponent component={<PrincipalManager/>}/>}/>
      <Route path="/admin-settings" element={<LayoutComponent component={<SettingsManager/>}/>}/>
      
    </Routes>
   

  )
}

export default App