import { gql, useQuery } from "@apollo/client";

export const GET_AUTHENTICATED_USER = gql`
  query GetAuthenticatedUser {
    authUser {
      _id
      name
      username
      profilePicture
      gender
    }
  }
`;

export const GET_USER_AND_TRANSACTIONS = gql`
  query GetUserAndTransactions($userId: ID!) {
    user(userId: $userId) {
      _id
      name
      username
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
  }
`;
