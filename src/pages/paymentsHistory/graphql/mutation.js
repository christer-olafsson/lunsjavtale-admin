import { gql } from "@apollo/client";

export const PAYMENT_HISTORY_DELETE = gql`
  mutation PaymentHistoryDelete ($ids: [ID]){
    paymentHistoryDelete(ids: $ids){
    message
  }
  }
`