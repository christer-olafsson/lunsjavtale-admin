import { gql } from "@apollo/client";

export const ADD_NEW_ADMINISTRATOR = gql`
  mutation AddNewAdministrator ($input: AddAdministratorInput!){
    addNewAdministrator(input:$input){
      message
    }
  }
`

export const USER_PASSWORD_RESET = gql`
  mutation UserPasswordReset ($id:ID!, $password: String!){
    userPasswordReset(id:$id, password:$password){
      message
    }
  }
`

export const USER_DELETE = gql`
  mutation UserDelete ($email:String!){
    userDelete(email:$email){
      message
    }
  }
`