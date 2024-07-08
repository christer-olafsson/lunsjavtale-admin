import { gql } from "@apollo/client";

export const WITHDRAW_REQ_MUTATION = gql`
  mutation WithdrawReqMutation ($id:ID, $note:String, $status: String, $withdrawAmount: Decimal){
    withdrawRequestMutation(id:$id, note:$note, status: $status, withdrawAmount: $withdrawAmount){
      message
    }
  }
`

export const WITHDRAW_REQ_DELETE = gql`
  mutation WithdrawReqDelete($id: ID!){
      withdrawRequestDelete(id: $id){
      message
    }
  }
`