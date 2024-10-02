import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) {
          throw new Error("User Unauthorized!!!");
        }
        const userId = await context.getUser()._id;
        // console.log("USER IN FROM CONTEXT:", userId);
        const transactions = await Transaction.find({ userId });
        return transactions;
      } catch (error) {
        console.log("ERROR IN GETTING TRANSACTIONS", error.message);
        throw new Error(error.message || "Internal server error");
      }
    },

    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        console.log("ERROR IN GETTING TRANSACTION", error.message);
        throw new Error(error.message || "Internal server error");
      }
    },

    categoryStatistics: async (_, __, context) => {
      if (!context?.getUser()) throw new Error("User Un-authorized");
      const userId = context?.getUser()._id;
      try {
        const transactions = await Transaction.find({ userId });
        let transactionMap = {};
        transactions.forEach((transaction) => {
          if (!transactionMap[transaction.category]) {
            transactionMap[transaction.category] = 0;
          }
          transactionMap[transaction.category] += transaction.amount;
        });
        return Object.entries(transactionMap).map(([category, totalAmount]) => ({
          category,
          totalAmount,
        }));
      } catch (error) {
        console.log("ERROR IN GETTING TRANSACTION STATISTICS:", error.message);
        throw new Error(error.message);
      }
    },
  },

  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (error) {
        console.log("ERROR IN CREATING TRANSACTION", error.message);
        throw new Error(error.message || "Internal server error");
      }
    },

    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          { $set: { ...input } },
          { new: true, runValidators: true }
        );
        return updatedTransaction;
      } catch (error) {
        console.log("ERROR IN UPDATING TRANSACTION", error.message);
        throw new Error(error.message || "Internal server error");
      }
    },

    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );
        return deletedTransaction;
      } catch (error) {
        console.log("ERROR IN DELETING TRANSACTION", error.message);
        throw new Error(error.message || "Internal server error");
      }
    },

    // TODO ==> add transaction / user relationship
  },

  Transaction:{
    user: async (parent)=>{
      try {
        const user = await User.findById(parent.userId);
        return user;
      } catch (error) {
        console.log("ERROR IN TRANSACTION.USER RESOLVER:", error.message);
        throw new Error(error.message || "Internal server error");
      }
    }
  }
};

export default transactionResolver;
