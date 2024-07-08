import { gql } from "@apollo/client";

export const CREATE_PAYMENT = gql`
  mutation CreatePayment ($input: OrderPaymentMutationInput!){
      createPayment(input: $input){
      message
    }
  }
`

export const PAYMENT_HISTORY_DELETE = gql`
  mutation PaymentHistoryDelete ($ids: [ID]){
    paymentHistoryDelete(ids: $ids){
    message
  }
  }
`