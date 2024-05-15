import { gql } from "@apollo/client";

export const VALID_AREA_MUTATION = gql`
  mutation ValidAreaMutation ($input: ValidAreaMutationInput!){
    validAreaMutation(input: $input){
      success
      message
    }
  }
`

export const VALID_AREA_DELETE = gql`
  mutation ValidAreaDelete ($id: ID!){
    validAreaDelete(id:$id){
      message
      success
    }
  }
`