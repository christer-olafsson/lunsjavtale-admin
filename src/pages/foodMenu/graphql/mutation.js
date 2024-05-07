import { gql } from "@apollo/client";

export const CREATE_CATEGORY = gql`
  mutation CategoryMutation ($input: CategoryMutationInput!){
    categoryMutation(input:$input){
      category
      success
      message
      instance
    }
  }
`