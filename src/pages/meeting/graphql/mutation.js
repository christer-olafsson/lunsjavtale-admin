import { gql } from "@apollo/client";

export const MEETING_MUTATION = gql`
  mutation FoodMeetingMutation ($input: FoodMeetingMutationInput!){
    foodMeetingMutation(input:$input){
      success
      message
    }
  }
`

export const MEETING_RESOLVE = gql`
  mutation foodMeetingResolve ($id: ID, $note: String, $status: String){
    foodMeetingResolve(id: $id, note: $note, status: $status){
      message
    }
  }
`

export const FOOD_MEETING_DELETE = gql`
  mutation FoodMeetingDelete ($id: ID){
    foodMeetingDelete(id: $id){
      message
    }
  }
`