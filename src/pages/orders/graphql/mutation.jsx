import { gql } from "@apollo/client";

export const ORDER_STATUS_UPDATE = gql`
  mutation OrderStatusUpdate ($id: ID, $status: String){
    orderStatusUpdate(id:$id, status: $status){
      message
    }
  }
`