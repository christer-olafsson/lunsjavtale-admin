import { gql } from "@apollo/client";

export const NOTIFICATION_DELETE = gql`
  mutation NotificationDelete ($ids: [ID]){
      notificationDelete(ids: $ids){
      message
    }
  }
`