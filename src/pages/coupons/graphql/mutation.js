import { gql } from "@apollo/client";

export const COUPON_MUTATION = gql`
  mutation CouponMutation ($input:CouponMutationInput!){
    couponMutation(input:$input){
      success
      message
    }
  }
`