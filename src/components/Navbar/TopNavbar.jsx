import React, { useState, useEffect, useContext } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { userContext } from "../../Context/UserContext";
const bgColor = "white";
const modalColor = "bg-gray-900";
import ServerApi from "../../serverApi/axios";

const NavbarContent = () => {
  const navLinksEmployee = [
    { title: "Rota", url: "/employeerota" },
    { title: "Notifications", url: "/notifications" },
    { title: "Holidays", url: "/holidayrequests" },
    { title: "View Requests", url: "/employeerequests" },
  ];

  const navLinksAdmin = [
    { title: "Master Rota", url: "/rota" },
    { title: "Archived Rotas", url: "/archivedrotas" },
    { title: "Requests", url: "/requests" },
    { title: "View Requests", url: "/adminrequests" },
    { title: "View Venues", url: "/venues" },
  ];

  const { state } = userContext();

  return state?.userData?.role === "admin" ? navLinksAdmin : navLinksEmployee;
};

const TopNavbar = () => {
  const handleLogout = async () => {
    try {
      ServerApi.get("api/v1/auth/logout");
      dispatch({ type: "LOGOUT" });
    } catch (err) {
      console.log(err);
    }
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);
  const [showModal, setShowModal] = useState(false);
  const navLinks = NavbarContent(); // Get the correct set of navigation links

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleBarsIconClick = () => {
    toggleModal();
  };

  return (
    <>
      {isMobile && (
        // Mobile Navbar Code Here
        <nav className={`h-14 ${bgColor} py-4 px-4 border-b z-[1000]`}>
          <div className="mx-auto flex justify-between items-center ">
            <p className="overflow-hidden transition-all font-bold text-2xl text-darkBlue">
              ROTAPAL
            </p>
            <div className="flex justify-end items-center gap-6 text-white cursor-pointer">
              <FaBars
                onClick={handleBarsIconClick}
                className="text-black cursor-pointer"
              />
            </div>
          </div>
          {showModal && (
            <div className="fixed inset-0 flex justify-center items-center z-[9999]">
              <div className={`absolute inset-0 ${modalColor} z-[9998]`} />
              <FaTimes
                className="absolute top-6 right-4 text-white cursor-pointer z-[9999]"
                onClick={toggleModal}
                style={{ fontSize: "16px" }}
              />
              <div className="relative bg-gray-900 w-full z-[9999]">
                <div className="flex flex-col gap-8 items-center justify-center h-full">
                  {navLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.url}
                      className="text-white  font-semibold text-2xl cursor-pointer"
                      onClick={toggleModal}
                    >
                      {link.title}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="text-white  font-semibold text-2xl cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>
      )}
    </>
  );
};

export default TopNavbar;
