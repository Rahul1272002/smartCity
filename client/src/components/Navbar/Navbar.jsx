import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div>
      <nav className="bg-blue-500 p-7 fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo or brand */}
            <div className="text-white text-lg font-bold">
              <Link to="/" className="text-white">Visual Pollution</Link>
            </div>
            {/* Navigation links */}
            <ul className="flex space-x-4">
              <li><Link to="/" className="text-white">Home</Link></li>
              <li><Link to="/map" className="text-white">Map</Link></li>
              <li><Link to="/zone" className="text-white">Zone</Link></li>
              <li><a href="#" className="text-white">About</a></li>
              <li><a href="#" className="text-white">Contact</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
