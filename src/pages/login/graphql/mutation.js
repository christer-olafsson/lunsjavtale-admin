import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!){
    loginUser(email: $email, password:$password){
      success
      access
      user{
        isAdmin
      }
    }
  }
`

export const LOGOUT = gql`
  mutation{
  logout{
    success
    message
  }
}
`

export const PASSWORD_RESET = gql`
  mutation PasswordResetMail ($email: String!){
    passwordResetMail(email:$email){
      success
      message
  }
}
`

export const SEND_VERIFICATION_MAIL = gql`
  mutation SendVerificationMail ($email: String!){
    sendVerificationMail(email:$email){
    success
    message
  }
  }
`