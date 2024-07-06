import { gql } from "@apollo/client";

export const ORDER_STATUS_UPDATE = gql`
  mutation OrderStatusUpdate ($id: ID, $status: String){
    orderStatusUpdate(id:$id, status: $status){
      message
    }
  }
`

export const APPLY_COUPON = gql`
  mutation ApplyCoupon ($orderId: Float, $coupon: String){
    applyCoupon(orderId: $orderId,coupon:$coupon){
      message
    }
  }
`

export const ORDER_HISTORY_DELETE = gql`
  mutation OrderHistoryDelete ($id: ID){
      orderHistoryDelete(id: $id){
      message
    }
  }
`