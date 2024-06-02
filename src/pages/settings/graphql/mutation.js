import { gql } from "@apollo/client";

export const ADD_NEW_ADMINISTRATOR = gql`
  mutation AddNewAdministrator ($input: AddAdministratorInput!){
    addNewAdministrator(input:$input){
      message
    }
  }
`