import { gql } from "@apollo/client";

export const PROMOTION_MUTATION = gql`
  mutation PromotionMutation ($input: PromotionMutationInput!){
    promotionMutation(input: $input){
      success
      message
    }
  }
`