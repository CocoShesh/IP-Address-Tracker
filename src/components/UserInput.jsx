import React, { useEffect, useState } from "react";
import axios from "axios";
import L from "leaflet";

const UserInput = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  const [ipAddress, setIpAddress] = useState(null);
  const [userInput, setUserInput] = useState("");

  const fetchAddress = async () => {
    try {
      let url;
      if (userInput.replace(".", "").match(/^\d+$/)) {
        url = `${baseURL}apiKey=${apiKey}&ipAddress=${userInput}`;
      } else {
        url = `${baseURL}apiKey=${apiKey}&domain=${userInput}`;
      }
      const response = await axios.get(url);
      setIpAddress(response.data);
      const { lat, lng } = response.data.location;

      const mapContainer = L.DomUtil.get("map");
      if (mapContainer != null) {
        mapContainer._leaflet_id = null;
      }

      const map = L.map("map").setView([lat, lng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(
          `${response.data.ip}<br>${response.data.location.city}, ${response.data.location.country}`
        )
        .openPopup();
    } catch (error) {
      console.error("Error fetching IP address:", error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, [userInput]);

  return (
    <>
      <section className="h-[250px]   relative text-white bg-cover bg-desktop-background bg-no-repeat max-sm:bg-mobile-background">
        <section className="flex flex-col items-center justify-center pt-5">
          <h1 className="text-3xl">IP Address Tracker</h1>
          <section className="flex items-center  max-lg:w-full max-lg:px-3">
            <input
              type="search"
              placeholder="Search for any IP address or domain"
              className="lg:w-[400px] h-[50px] rounded-l-xl p-5 text-black mt-5 outline-none max-lg:w-full"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyPress={e =>
                e.key === "Enter" && setUserInput(e.target.value)
              }
            />
            <button
              className="bg-black text-white flex items-center justify-center h-[50px] mt-5 rounded-r-xl w-[50px]"
              onClick={fetchAddress} // Fetch data when button is clicked
            >
              <img src="icon-arrow.svg" alt="" />
            </button>
          </section>
        </section>
        <div id="map" className="min-h-screen relative -z-10 "></div>
        {ipAddress && (
          <section className="absolute bottom-[-70px]  text-black rounded-2xl p-7 lg:divide-x-2 divide-[#eeeeee] left-0 right-0 mx-auto bg-white w-[70%] h-[150px] flex max-lg:flex-col max-lg:h-fit  max-lg:bottom-[-250px]  justify-center items-center shadow">
            <section className="flex flex-col lg:pl-5 w-full h-full max-lg:items-center ">
              <h2 className="text-[#949494] text-sm font-bold">IP ADDRESS</h2>
              <p className="text-2xl mt-3 font-semibold max-lg:mt-1">
                {ipAddress.ip}
              </p>
            </section>
            <section className="flex flex-col lg:pl-5 w-full h-full max-lg:items-center max-lg:mt-2">
              <h2 className="text-[#949494] text-sm font-bold">LOCATION</h2>
              <p className="text-2xl mt-3 font-semibold max-lg:mt-1">
                {ipAddress.location.city}, {ipAddress.location.country}
                {ipAddress.location.postalCode}
              </p>
            </section>
            <section className="flex flex-col lg:pl-5 w-full h-full max-lg:items-center max-lg:mt-2">
              <h2 className="text-[#949494] text-sm font-bold">TIMEZONE</h2>
              <p className="text-2xl mt-3 font-semibold max-lg:mt-1">
                UTC {ipAddress.location.timezone}
              </p>
            </section>
            <section className="flex flex-col lg:pl-5 w-full h-full max-lg:items-center max-lg:text-center max-lg:mt-2 ">
              <h2 className="text-[#949494] text-sm font-bold ">ISP</h2>
              <p className="text-xl mt-3 font-semibold line-clamp-2 max-lg:mt-1">
                {ipAddress.isp}
              </p>
            </section>
          </section>
        )}
      </section>
    </>
  );
};

export default UserInput;
