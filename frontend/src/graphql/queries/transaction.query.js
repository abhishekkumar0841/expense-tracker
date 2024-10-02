import { gql } from "@apollo/client";

export const GET_ALL_TRANSACTIONS = gql`
  query GetAllTransactions {
    transactions {
      _id
      description
      paymentType
      category
      amount
      date
      location
    }
  }
`;

export const GET_TRANSACTION = gql`
  query GetTransaction($transactionId: ID!) {
    transaction(transactionId: $transactionId) {
      _id
      description
      paymentType
      category
      amount
      date
      location
      user {
        _id
        name
        username
        profilePicture
        gender
      }
    }
  }
`;

export const GET_TRANSACTIONS_STATISTICS = gql`
  query GetTransactionsStatistics {
    categoryStatistics {
      category
      totalAmount
    }
  }
`;
