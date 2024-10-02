import { gql } from "@apollo/client";

// Define mutation
export const SIGN_UP = gql`
  # Increments a back-end counter and gets its resulting value
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      name
      username
      password
      gender
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!){
    login(input: $input){
      _id
      name
      username
    }
  }
`

export const LOGOUT = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;
