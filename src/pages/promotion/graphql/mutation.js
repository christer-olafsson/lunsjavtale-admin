import { gql } from "@apollo/client";

export const PROMOTION_MUTATION = gql`
  mutation PromotionMutation ($input: PromotionMutationInput!){
    promotionMutation(input: $input){
      success
      message
    }
  }
`

export const PROMOTION_DELETE = gql`
  mutation PromotionDelete ($id: ID!){
    promotionDelete(id:$id){
      success
      message
    }
  }
`