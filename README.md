# TinyApp Project

**TinyApp** is a full stack web application built with Node and Express that allows users to shorten long URLs *(à la bit.ly)*.

## Final Product

!["Login Page"](./public/loginpage.jpeg)
!["Urls Page"](./public/urlspage.jpeg)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Usage

!["Sample Usage"](./public/sample.jpeg)

- URLs http://localhost:8080/u/Z1j5q3, *et al.* will be created. These can now be used as a link to redirect to the specific site without the lengthy url.
- A unique code is created everytime a url is generated.
- The original URL can be replaced if a unique code is already registered.