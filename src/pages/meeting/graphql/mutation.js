import { gql } from "@apollo/client";

export const FOOD_MEETING_DELETE = gql`
  mutation FoodMeetingDelete ($id: ID){
    foodMeetingDelete(id: $id){
      message
    }
  }
`