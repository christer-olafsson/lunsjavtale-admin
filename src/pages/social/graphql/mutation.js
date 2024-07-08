import { gql } from "@apollo/client";

export const FOLLOW_US_MUTATION = gql`
  mutation FollowUsMutation ($input: FollowUsMutationInput!){
    followUsMutation(input: $input){
      message
    }
  }
`

export const FOLLOW_US_DELETE = gql`
  mutation FollowUsDelete ($id:ID!){
    followUsDelete(id: $id){
      message
    }
  }
`