import { gql } from "@apollo/client";

export const FOLLOW_US_LIST = gql`
  query{
  followUsList{
    edges{
      node{
        id
        # title
        linkType
        link
        # photoUrl
        # fileId
      }
    }
  }
}
`