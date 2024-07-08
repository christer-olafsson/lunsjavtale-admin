import { gql } from "@apollo/client";

export const BRAND_MUTATION = gql`
  mutation SupportedBrandMutation ($input: SupportedBrandMutationInput!){
    supportedBrandMutation(input:$input){
    success
    message
  }
  }
`

export const BRAND_DELETE = gql`
  mutation SupportedBrandDelete ($id: ID!){
    supportedBrandDelete(id: $id){
      success
      message
    }
  }
`