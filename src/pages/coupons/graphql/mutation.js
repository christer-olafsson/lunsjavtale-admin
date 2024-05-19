import { gql } from "@apollo/client";

export const COUPON_MUTATION = gql`
  mutation CouponMutation ($input:CouponMutationInput!){
    couponMutation(input:$input){
      success
      message
    }
  }
`
export const COUPON_DELETE = gql`
  mutation CouponDelete ($id: ID!){
      couponDelete(id:$id){
      message
    }
  }
`