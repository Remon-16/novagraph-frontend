declare namespace API {
  type BaseResponseBoolean = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseLoginUserVO = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponseLong = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponsePageMessageVO = {
    code?: number
    data?: PageMessageVO
    message?: string
  }

  type BaseResponseUserVO = {
    code?: number
    data?: UserVO
    message?: string
  }

  type getUserVOByIdParams = {
    id: number
  }

  type LoginUserVO = {
    id?: number
    userAccount?: string
    token?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    createTime?: string
  }

  type MessageVO = {
    id?: number
    userId?: number
    content?: string
    messageType?: string
    messageState?: string
    senderId?: number
    screenplayId?: number
    commentId?: number
    screenplayCommentVO?: ScreenplayCommentVO
    createTime?: string
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type PageMessageVO = {
    records?: MessageVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageMessageVO
    searchCount?: PageMessageVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type ScreenplayCommentVO = {
    id?: number
    userId?: number
    screenplayId?: number
    targetId?: number
    secondTargetId?: number
    targetUserId?: number
    targetUserName?: string
    content?: string
    user?: UserVO
    createTime?: string
  }

  type updateUserAvatarParams = {
    userUpdateInfoRequest: UserUpdateInfoRequest
  }

  type updateUserInfoParams = {
    userUpdateInfoRequest: UserUpdateInfoRequest
  }

  type UserLoginRequest = {
    userAccount?: string
    userPassword?: string
  }

  type UserMessageRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    userId?: number
    messageId?: number
    messageType?: string
    messageStatus?: string
  }

  type UserRegisterRequest = {
    userAccount?: string
    userPassword?: string
    checkPassword?: string
  }

  type UserUpdateInfoRequest = {
    id?: number
    userName?: string
    userAvatar?: string
    userProfile?: string
    vipExpiry?: string
    vipType?: string
  }

  type UserVO = {
    id?: number
    userAccount?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    createTime?: string
  }
}
