import jwt from "jsonwebtoken";
// import User from "../models/User";

// export const verifyToken = async (req, res, next) => {
//   try {
//     let token = req.header("Authorization");

//     if (!token) {
//       return res.status(403).send("Access Denied");
//     }

//     if (token.startsWith("Bearer ")) {
//       token = token.slice(7, token.length).trimLeft();
//     }

//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const User_Secret_key = process.env.JWT_SECRET;

export const userVerification = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    console.log(authorizationHeader, "Auther this");

    const token = authorizationHeader.split(" ")[1];

    if (token === "undefined") {
      return res.status(401).json({ message: "Authentication failed Anurag" });
    } else {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decodedToken, "decoded token");

      console.log(decodedToken, "this is decoded token");

      req.userId = decodedToken._id;

      next();
    }
  } catch (error) {
    return res.status(401).json({ message: "Please Login" });
  }
};

export const empVerification = async (req, res, next) => {
  try {
    console.log("inside verification");

    const authorizationHeader = req.headers.authorization;

    console.log(authorizationHeader, "Auther this");

    const token = authorizationHeader.split(" ")[1];

    if (token === "undefined") {
      return res.status(401).json({ message: "Authentication failed Anurag" });
    } else {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decodedToken, "decoded token");

      console.log(decodedToken, "this is decoded token");

      req.userId = decodedToken._id;

      next();
    }
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export const adminVerification = async (req, res, next) => {
  try {
    console.log(" admin inside verification");

    const authorizationHeader = req.headers.authorization;

    console.log(authorizationHeader, "Auther this");

    const token = authorizationHeader.split(" ")[1];

    if (token === "undefined") {
      return res.status(401).json({ message: "Authentication failed Anurag" });
    } else {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decodedToken, "decoded token");

      console.log(decodedToken, "this is decoded token");

      req.userId = decodedToken._id;

      next();
    }
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};
