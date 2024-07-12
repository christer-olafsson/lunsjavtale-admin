import { gql } from "@apollo/client";

export const SALES_HISTORY_DELETE = gql`
  mutation SalesHistoryDelete ($ids:[ID]){
    salesHistoryDelete(ids:$ids){
      message
    }
  }
`