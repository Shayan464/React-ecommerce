import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import About from './components/ContactHome/About';
import Contact from './components/ContactHome/Contact';
import Games from './components/ContactHome/Games';
import Pc from './components/ContactHome/Pc';
import ProductList from './components/ContactHome/ProductList';
import UserRegistration from './UserRegistration';
import AuthGate from './AuthGate';
import CartPage from './CartPage';
import AddProduct from './components/ContactHome/AddProduct';
import Error from './components/ContactHome/Error';
import Login from './LoginPage';
import Home from './components/ContactHome/Home';
import RoleGate from './RoleGate';
import { AdminPage } from './UserType/AdminPage';
import { UserPage } from './UserType/UserPage';

function App() {
  return (
    <div className="h-screen overflow-hidden bg-cover bg-center bg-fixed bg-[url('https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg')]">
      <div className="h-full backdrop-blur-sm bg-white/10">
        <Router>
          <div className="flex flex-col h-full text-black">
            <div className="h-20 flex-shrink-0">
              <Header />
            </div>
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-4">
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/UserRegister" element={<UserRegistration />} />

                  <Route element={<AuthGate />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/Add" element={<AddProduct />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/pc" element={<Pc />} />
                    <Route path="/ProductLists" element={<ProductList />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="*" element={<Error />} />

                    <Route element={<RoleGate allowedRoles={['Admin']} />}>
                      <Route path="/admin" element={<AdminPage />}>
                        <Route
                          path="UserRegister"
                          element={<UserRegistration />}
                        />
                      </Route>
                    </Route>

                    <Route element={<RoleGate allowedRoles={['User']} />}>
                      <Route path="/user" element={<UserPage />} />
                    </Route>
                  </Route>
                </Routes>
              </main>
            </div>
            <div>
              <Footer />
            </div>
          </div>
        </Router>
      </div>
    </div>
  );
}
export default App;
