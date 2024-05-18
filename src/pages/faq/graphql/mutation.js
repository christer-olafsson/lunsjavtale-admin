import { gql } from "@apollo/client";

export const FAQ_MUTATION = gql`
  mutation FaqMutation ($input: FAQMutationInput!){
    FAQMutation(input:$input){
      success
      message
    }
  }
`

export const FAQ_DELETE = gql`
  mutation FaqDelete ($id: ID!){
    FAQDelete(id: $id){
    message
  }
  }
`