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

  type getUserByIdParams = {
    userId: number
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

  type updateUserAvatarParams = {
    userUpdateInfoRequest: UserUpdateInfoRequest
  }

  type updateUserInfoParams = {
    userUpdateInfoRequest: UserUpdateInfoRequest
  }

  type getUserVOByIdParams = {
    id: number
  }

  type User = {
    id?: number
    userAccount?: string
    userPassword?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    roomCode?: string
    editTime?: string
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type UserListVO = {
    userListJson?: string
  }

  type BaseResponseUserVO = {
    code?: number
    data?: UserVO
    message?: string
  }

  type UserLoginRequest = {
    userAccount?: string
    userPassword?: string
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

}
