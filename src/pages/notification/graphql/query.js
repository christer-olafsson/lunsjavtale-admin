import { gql } from "@apollo/client";

export const ADMIN_NOTIFICATIONS = gql`
 query{
  adminNotifications{
    edges{
      node{
      id
        createdOn
        title
        message
        sentOn
        status
        isSeen
        objectId
        notificationType
      }
    }
  }
}
`

export const UNREAD_ADMIN_NOTIFICATIONCOUNT = gql`
  query{
    unreadAdminNotificationCount
  }
`
