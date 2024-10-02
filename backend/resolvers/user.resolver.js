import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
import bcrypt from "bcryptjs";

const userResolvers = {
  Query: {
    users: async (_, __, { req, res }) => {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        console.log("ERROR IN GETTING USERS", error.message);
        throw new Error(error.message || "Internal server error");
      }
    },

    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (error) {
        console.log("ERROR IN AUTH-USER", error.message);
        throw new Error(error.message || "Internal server error");
      }
    },

    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (error) {
        console.log("ERROR IN GETTING USER", error.message);
        throw new Error(error.message || "Internal server error");
      }
    },

    // TODO ==> add user / transaction relations
  },

  Mutation: {
    signUp: async (_, { input }, context) => {
      const { username, name, password, gender } = input;
      if (!username || !name || !password || !gender) {
        throw new Error("All fields are required!");
      }

      try {
        const user = await User.findOne({ username });
        if (user) {
          throw new Error("User already exists!");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // MAIN URL --> https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
          name,
          password: hashedPassword,
          username,
          gender,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (error) {
        console.log("ERROR IN SIGNUP", error.message);
        throw new Error(error.message || "Internal server error");
      }
    },

    login: async (_, { input }, context) => {
      const { username, password } = input;
      if (!username || !password) throw new Error("All fields are required");
      try {
        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });

        await context.login(user);
        return user;
      } catch (error) {
        console.log("ERROR IN LOGIN", error);
        throw new Error(error || "Internal server error");
      }
    },

    logout: async (_, __, context) => {
      try {
        await context.logout();
        context.req.session.destroy((err) => {
          if (err) throw err;
        });
        context.res.clearCookie("connect.sid");
        return { message: "Logged out successfully" };
      } catch (error) {
        console.log("ERROR IN LOGOUT", error.message);
        throw new Error(error.message || "Internal server error");
      }
    },
  },

  User: {
    transactions: async (parent) => {
      try {
        const transactions = await Transaction.find({ userId: parent._id });
        return transactions;
      } catch (error) {
        console.log("ERROR IN USER.TRANSACTIONS RESOLVER:", error.message);
        throw new Error(error.message || "Internal server error");
      }
    },
  },
};

export default userResolvers;
