import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className=" bottom-0 left-0 z-20 w-full p-4 bg-gray-700 border-t border-gray-500 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
        <span className="text-sm text-gray-200 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            mikovoteapp
          </a>
          . All Rights Reserved.
        </span>
      </footer>
    </div>
  );
};

export default Footer;
