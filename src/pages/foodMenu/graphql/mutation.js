import { gql } from "@apollo/client";

export const CREATE_CATEGORY = gql`
  mutation CategoryMutation ($input: CategoryMutationInput!){
    categoryMutation(input:$input){
      success
      message
    }
  }
`

export const CATEGORY_DELETE = gql`
  mutation CategoryDelete ($id: ID!){
    categoryDelete(id:$id){
    success
    message
  }
  }
`

export const CREATE_PRODUCT = gql`
  mutation ProductMutation ($input: ProductInput, $ingredients: [String], $attachments: [ProductAttachmentInput]){
    productMutation(input:$input,ingredients:$ingredients,attachments: $attachments){
      success
      message
    }
  }
`