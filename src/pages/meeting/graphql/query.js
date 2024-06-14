import { gql } from "@apollo/client";

export const FOOD_MEETINGS = gql`
  query{
  foodMeetings{
    edges{
      node{
        id
        createdOn
        title
        meetingType
        meetingTime
        status
        note
        topics {
          edges {
            node {
              id
              name
            }
          }
        }
        companyName
        attendees {
          edges {
            node {
              id
              firstName
              lastName
              username
              email
              role
            }
          }
        }
        company {
          id
          postCode
          status
          noOfEmployees
          name
          email
          logoUrl
          isBlocked
        }
        firstName
        lastName
        email
        phone
        description
      }
    }
  }
}
`