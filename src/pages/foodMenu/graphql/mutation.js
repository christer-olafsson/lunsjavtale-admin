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

export const PRODUCT_MUTATION = gql`
  mutation ProductMutation ($input: ProductInput, $ingredients: [String], $attachments: [ProductAttachmentInput]!){
    productMutation(input:$input,ingredients:$ingredients,attachments: $attachments){
      success
      message
    }
  }
`

export const PRODUCT_DELETE = gql`
  mutation ProductDelete ($id: ID){
    productDelete(id:$id){
      success
      message
    }
  }
`